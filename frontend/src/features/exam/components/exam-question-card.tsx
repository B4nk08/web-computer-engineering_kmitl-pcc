"use client";

import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamQuestionPlayItemDto } from "../types";

type ExamQuestionCardProps = {
  question: ExamQuestionPlayItemDto;
  index: number;
  selectedKey: string | undefined;
  flagged: boolean;
  onAnswer: (choiceKey: string) => void;
  onToggleFlag: () => void;
};

export function ExamQuestionCard({
  question,
  index,
  selectedKey,
  flagged,
  onAnswer,
  onToggleFlag,
}: ExamQuestionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm font-medium text-slate-800 md:text-base">
          <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md bg-indigo-950 text-xs font-semibold text-white">
            {index + 1}
          </span>
          {question.prompt}
        </p>
        <button
          type="button"
          onClick={onToggleFlag}
          title="ทำเครื่องหมายไว้ดูทีหลัง"
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors",
            flagged
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500"
          )}
        >
          <Flag className={cn("size-3.5", flagged ? "fill-amber-400" : "")} />
        </button>
      </div>

      {question.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.image_url}
          alt=""
          className="mt-3 max-h-64 w-full rounded-lg border border-slate-100 object-contain"
        />
      ) : null}

      <div className="mt-3 space-y-2">
        {question.choices.map((choice) => {
          const active = selectedKey === choice.key;
          return (
            <button
              key={choice.key}
              type="button"
              onClick={() => onAnswer(choice.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold uppercase",
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 text-slate-500"
                )}
              >
                {choice.key}
              </span>
              <span>{choice.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
