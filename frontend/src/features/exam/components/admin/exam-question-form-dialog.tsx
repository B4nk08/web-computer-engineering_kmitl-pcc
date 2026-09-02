"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
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
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border bg-background p-6 shadow-xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                {isEdit ? "แก้ไขข้อสอบ" : "เพิ่มข้อสอบ"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                กลุ่ม <span className="font-medium text-foreground">{subjectCode}</span> · โหมด Mock
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" disabled={submitting} aria-label="ปิด">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <form className="mt-4 flex-1 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="exam-q-prompt">คำถาม</Label>
              <textarea
                id="exam-q-prompt"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={submitting}
                placeholder="พิมพ์โจทย์ข้อสอบ..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={submitting}
              />
              เปิดใช้งานข้อนี้ (ถ้าปิด จะไม่ถูกสุ่มออกมาตอนสอบ)
            </label>

            {error ? (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มข้อสอบ"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
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
