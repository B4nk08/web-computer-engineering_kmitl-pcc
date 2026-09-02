"use client";

import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUESTIONS_PER_PAGE } from "../constants";
import type { ExamQuestionPlayItemDto } from "../types";

type ExamNavGridProps = {
  questions: ExamQuestionPlayItemDto[];
  answers: Record<string, string>;
  flagged: string[];
  currentPage: number;
  /** taking = เน้นข้อในหน้าปัจจุบัน, review = เน้นข้อที่ยังไม่ตอบด้วยสีแดงเตือน */
  variant: "taking" | "review";
  onSelect: (questionId: string) => void;
};

export function ExamNavGrid({
  questions,
  answers,
  flagged,
  currentPage,
  variant,
  onSelect,
}: ExamNavGridProps) {
  const currentPageStart = currentPage * QUESTIONS_PER_PAGE;
  const currentPageEnd = currentPageStart + QUESTIONS_PER_PAGE;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-white shadow-lg">
      <p className="mb-3 text-sm font-semibold text-slate-200">รายละเอียด</p>

      <div className="mb-4 space-y-1.5 text-xs text-slate-300">
        {variant === "taking" ? (
          <>
            <LegendItem swatch="border border-slate-500 bg-slate-800" label="ยังไม่ตอบ" />
            <LegendItem swatch="bg-emerald-500" label="ตอบแล้ว" />
            <LegendItem swatch="bg-amber-400" label="ทำเครื่องหมายไว้" />
            <LegendItem swatch="ring-2 ring-sky-400 bg-slate-800" label="ข้อในหน้าปัจจุบัน" />
          </>
        ) : (
          <>
            <LegendItem swatch="bg-red-600" label="ยังไม่ตอบ" />
            <LegendItem swatch="bg-emerald-500" label="ตอบแล้ว" />
          </>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {questions.map((question, idx) => {
          const isAnswered = Boolean(answers[question.id]);
          const isFlagged = flagged.includes(question.id);
          const isInCurrentPage = idx >= currentPageStart && idx < currentPageEnd;

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(question.id)}
              title={`ข้อ ${idx + 1}`}
              className={cn(
                "relative flex size-8 items-center justify-center rounded-md text-xs font-medium transition-transform hover:scale-105",
                variant === "taking"
                  ? isAnswered
                    ? "bg-emerald-500 text-white"
                    : isFlagged
                      ? "bg-amber-400 text-slate-900"
                      : "border border-slate-500 bg-slate-800 text-slate-200"
                  : isAnswered
                    ? "bg-emerald-500 text-white"
                    : "bg-red-600 text-white",
                variant === "taking" && isInCurrentPage ? "ring-2 ring-sky-400" : ""
              )}
            >
              {idx + 1}
              {isFlagged ? (
                <Flag className="absolute -right-1 -top-1 size-3 fill-amber-400 text-amber-400" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3.5 rounded-sm", swatch)} />
      <span>{label}</span>
    </div>
  );
}
