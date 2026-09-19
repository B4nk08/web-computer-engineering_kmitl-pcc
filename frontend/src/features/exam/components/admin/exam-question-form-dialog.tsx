"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AdminDialogFrame,
  AdminFormActions,
  AdminStatus,
  AdminTextarea,
  AdminToggle,
} from "@/components/admin";
import { createExamQuestion, updateExamQuestion } from "../../api";
import type { ExamChoiceAdminDto, ExamQuestionAdminDto } from "../../types";

const CHOICE_KEYS = ["a", "b", "c", "d"] as const;
const CHOICE_LABELS: Record<(typeof CHOICE_KEYS)[number], string> = {
  a: "ก",
  b: "ข",
  c: "ค",
  d: "ง",
};

type ChoiceDraft = {
  key: (typeof CHOICE_KEYS)[number];
  text: string;
};

function emptyChoices(): ChoiceDraft[] {
  return CHOICE_KEYS.map((key) => ({ key, text: "" }));
}

type ExamQuestionFormDialogProps = {
  subjectCode: string;
  /** ถ้ามี = โหมดแก้ไข */
  question?: ExamQuestionAdminDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function ExamQuestionFormDialog({
  subjectCode,
  question,
  open,
  onOpenChange,
  onSaved,
}: ExamQuestionFormDialogProps) {
  const isEdit = Boolean(question);
  const [prompt, setPrompt] = useState("");
  const [choices, setChoices] = useState<ChoiceDraft[]>(emptyChoices());
  const [correctKey, setCorrectKey] = useState<(typeof CHOICE_KEYS)[number]>("a");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (question) {
      setPrompt(question.prompt);
      const mapped = CHOICE_KEYS.map((key) => {
        const found = question.choices.find((c) => c.key === key);
        return { key, text: found?.text ?? "" };
      });
      setChoices(mapped);
      const correct = question.choices.find((c) => c.is_correct)?.key;
      setCorrectKey(
        CHOICE_KEYS.includes(correct as (typeof CHOICE_KEYS)[number])
          ? (correct as (typeof CHOICE_KEYS)[number])
          : "a"
      );
      setIsActive(question.is_active);
    } else {
      setPrompt("");
      setChoices(emptyChoices());
      setCorrectKey("a");
      setIsActive(true);
    }
    setError(null);
  }, [open, question]);

  function updateChoiceText(key: (typeof CHOICE_KEYS)[number], text: string) {
    setChoices((prev) => prev.map((c) => (c.key === key ? { ...c, text } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const filled = choices.filter((c) => c.text.trim());
    if (filled.length < 2) {
      setError("ต้องมีตัวเลือกอย่างน้อย 2 ข้อ");
      return;
    }
    if (!filled.some((c) => c.key === correctKey)) {
      setError("คำตอบที่ถูกต้องต้องมีข้อความ");
      return;
    }

    const payloadChoices: ExamChoiceAdminDto[] = filled.map((c) => ({
      key: c.key,
      text: c.text.trim(),
      is_correct: c.key === correctKey,
    }));

    setSubmitting(true);
    try {
      if (isEdit && question) {
        await updateExamQuestion(question.id, {
          prompt: prompt.trim(),
          choices: payloadChoices,
          is_active: isActive,
        });
      } else {
        await createExamQuestion({
          subject: subjectCode,
          mode: "mock",
          prompt: prompt.trim(),
          choices: payloadChoices,
          is_active: isActive,
        });
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "บันทึกข้อสอบไม่สำเร็จ"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!submitting) onOpenChange(next);
      }}
    >
      <AdminDialogFrame
        title={isEdit ? "แก้ไขข้อสอบ" : "เพิ่มข้อสอบ"}
        description={`กลุ่ม ${subjectCode} · โหมด Mock`}
        submitting={submitting}
        wide
      >
          <form className="mt-4 flex-1 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="exam-q-prompt">คำถาม</Label>
              <AdminTextarea
                id="exam-q-prompt"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={submitting}
                placeholder="พิมพ์โจทย์ข้อสอบ..."
              />
            </div>

            <div className="space-y-3">
              <Label>ตัวเลือก (เลือกวงกลมด้านซ้ายเป็นคำตอบที่ถูก)</Label>
              {choices.map((choice) => (
                <div key={choice.key} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectKey(choice.key)}
                    disabled={submitting}
                    title="ตั้งเป็นคำตอบที่ถูก"
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      correctKey === choice.key
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-input text-muted-foreground hover:border-emerald-400"
                    )}
                  >
                    {CHOICE_LABELS[choice.key]}
                  </button>
                  <Input
                    value={choice.text}
                    onChange={(e) => updateChoiceText(choice.key, e.target.value)}
                    placeholder={`ตัวเลือก ${CHOICE_LABELS[choice.key]}`}
                    disabled={submitting}
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                ตัวเลือกที่เว้นว่างจะไม่ถูกบันทึก — ต้องมีอย่างน้อย 2 ข้อ
              </p>
            </div>

            <AdminToggle
              checked={isActive}
              onChange={setIsActive}
              disabled={submitting}
              label="เปิดใช้งานข้อนี้ (ถ้าปิด จะไม่ถูกสุ่มออกมาตอนสอบ)"
            />

            {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

            <AdminFormActions>
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มข้อสอบ"}
              </Button>
            </AdminFormActions>
          </form>
      </AdminDialogFrame>
    </Dialog.Root>
  );
}

/** ปุ่ม trigger สำหรับเปิด dialog เพิ่มข้อสอบใหม่ */
export function ExamQuestionAddButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      <Plus className="size-4" />
      เพิ่มข้อสอบ
    </Button>
  );
}
