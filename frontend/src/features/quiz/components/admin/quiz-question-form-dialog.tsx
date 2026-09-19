"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdminDialogFrame,
  AdminFormActions,
  AdminSelect,
  AdminStatus,
  AdminTextarea,
} from "@/components/admin";
import { ApiError } from "@/lib/api";
import { addQuizQuestion, updateQuizQuestion } from "../../api";
import type { CareerClusterDto, QuizQuestionAdminDto } from "../../api";

const LETTERS = ["A", "B", "C", "D"] as const;
const WEIGHTS = [3, 2, 1, 0] as const;

const WEIGHT_LABELS: Record<(typeof WEIGHTS)[number], string> = {
  3: "พร้อมมาก (3)",
  2: "พอใช้ (2)",
  1: "ยังไม่ค่อยพร้อม (1)",
  0: "ยังไม่พร้อม (0)",
};

type QuizKind = "internal" | "external";

type OptionDraft = {
  label: string;
  cluster: string;
  weight: number;
};

function emptyOptions(kind: QuizKind): OptionDraft[] {
  return LETTERS.map((_, index) => ({
    label: "",
    cluster: "",
    weight: kind === "external" ? 3 - index : 0,
  }));
}

function clusterFromScoreMap(scoreMap: Record<string, number> | null | undefined): string {
  if (!scoreMap) return "";
  const entries = Object.entries(scoreMap).filter(([key]) => key !== "readiness");
  if (entries.length === 0) return "";
  entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  return entries[0]?.[0] ?? "";
}

function weightFromScoreMap(scoreMap: Record<string, number> | null | undefined): number {
  if (!scoreMap) return 0;
  if (typeof scoreMap.readiness === "number") return scoreMap.readiness;
  return 0;
}

type QuizQuestionFormDialogProps = {
  quizId: string;
  kind: QuizKind;
  clusters: CareerClusterDto[];
  question?: QuizQuestionAdminDto | null;
  nextSortOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function QuizQuestionFormDialog({
  quizId,
  kind,
  clusters,
  question,
  nextSortOrder,
  open,
  onOpenChange,
  onSaved,
}: QuizQuestionFormDialogProps) {
  const isEdit = Boolean(question);
  const isExternal = kind === "external";
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>(emptyOptions(kind));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (question) {
      setPrompt(question.prompt);
      const mapped = LETTERS.map((_, index) => {
        const found = question.options[index];
        return {
          label: found?.label ?? "",
          cluster: clusterFromScoreMap(found?.score_map),
          weight: weightFromScoreMap(found?.score_map),
        };
      });
      setOptions(mapped);
    } else {
      setPrompt("");
      setOptions(emptyOptions(kind));
    }
    setError(null);
  }, [open, question, kind]);

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setOptions((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const filled = options
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.label.trim());
    if (filled.length < 2) {
      setError("ต้องมีตัวเลือกอย่างน้อย 2 ข้อ");
      return;
    }
    if (!isExternal && filled.some((item) => !item.cluster)) {
      setError("ทุกตัวเลือกต้องเลือกกลุ่มสายงาน");
      return;
    }

    const payload = filled.map((item, order) => ({
      label: item.label.trim(),
      score_map: isExternal ? { readiness: item.weight } : { [item.cluster]: 1 },
      sort_order: order + 1,
    }));

    setSubmitting(true);
    try {
      if (isEdit && question) {
        await updateQuizQuestion(question.id, {
          prompt: prompt.trim(),
          options: payload,
        });
      } else {
        await addQuizQuestion(quizId, {
          prompt: prompt.trim(),
          sort_order: nextSortOrder,
          options: payload,
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
            : "บันทึกคำถามไม่สำเร็จ"
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
        title={isEdit ? "แก้ไขคำถาม" : "เพิ่มคำถาม"}
        description={
          isExternal
            ? "แต่ละตัวเลือกให้น้ำหนัก 0–3 เพื่อคิดเปอร์เซ็นต์ความพร้อม"
            : "แต่ละตัวเลือกต้องผูกกับกลุ่มสายงาน 1 กลุ่ม เพื่อใช้คำนวณผลควิซ"
        }
        submitting={submitting}
        wide
      >
          <form className="mt-4 flex-1 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="quiz-q-prompt">คำถาม</Label>
              <AdminTextarea
                id="quiz-q-prompt"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={submitting}
                placeholder="พิมพ์คำถาม..."
              />
            </div>

            <div className="space-y-3">
              <Label>{isExternal ? "ตัวเลือกและน้ำหนักความพร้อม" : "ตัวเลือกและกลุ่มสาย"}</Label>
              {options.map((option, index) => (
                <div key={LETTERS[index]} className="space-y-2 rounded-2xl border border-border/80 bg-[#fcfaf6] p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {LETTERS[index]}
                    </span>
                    <Input
                      value={option.label}
                      onChange={(e) => updateOption(index, { label: e.target.value })}
                      placeholder={`ข้อความตัวเลือก ${LETTERS[index]}`}
                      disabled={submitting}
                    />
                  </div>
                  {isExternal ? (
                    <AdminSelect
                      value={option.weight}
                      onChange={(e) => updateOption(index, { weight: Number(e.target.value) })}
                      disabled={submitting}
                    >
                      {WEIGHTS.map((weight) => (
                        <option key={weight} value={weight}>
                          {WEIGHT_LABELS[weight]}
                        </option>
                      ))}
                    </AdminSelect>
                  ) : (
                    <AdminSelect
                      value={option.cluster}
                      onChange={(e) => updateOption(index, { cluster: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">เลือกกลุ่มสายงาน</option>
                      {clusters.map((cluster) => (
                        <option key={cluster.code} value={cluster.code}>
                          {cluster.name}
                        </option>
                      ))}
                    </AdminSelect>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                {isExternal
                  ? "ตัวเลือกที่เว้นว่างจะไม่ถูกบันทึก — ต้องมีอย่างน้อย 2 ข้อ แต่ละข้อมีน้ำหนัก 0–3"
                  : "ตัวเลือกที่เว้นว่างจะไม่ถูกบันทึก — ต้องมีอย่างน้อย 2 ข้อ และแต่ละข้อต้องมีกลุ่มสาย"}
              </p>
            </div>

            {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

            <AdminFormActions>
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มคำถาม"}
              </Button>
            </AdminFormActions>
          </form>
      </AdminDialogFrame>
    </Dialog.Root>
  );
}

export function QuizQuestionAddButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      <Plus className="size-4" />
      เพิ่มคำถาม
    </Button>
  );
}
