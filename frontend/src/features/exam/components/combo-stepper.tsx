"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubjectIcon } from "../lib/subject-icon";
import type { ComboSubjectResult } from "../types";

type ComboStepperProps = {
  subjects: { code: string; name: string }[];
  /** index ของหมวดที่กำลังทำอยู่ตอนนี้ */
  currentIndex: number;
  /** ผลของหมวดที่ทำเสร็จแล้ว (ไม่รวมหมวดปัจจุบัน) */
  results: ComboSubjectResult[];
};

/** แถบแสดงหมวดหมู่ทั้งหมดของการสอบแบบ combo — บอกว่าตอนนี้อยู่หมวดไหน หมวดไหนทำเสร็จแล้ว */
export function ComboStepper({ subjects, currentIndex, results }: ComboStepperProps) {
  if (subjects.length <= 1) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl bg-indigo-950 px-4 py-3 text-white shadow-lg">
      <span className="mr-1 shrink-0 text-xs font-medium text-indigo-300">
        หมวดที่ {currentIndex + 1}/{subjects.length}
      </span>
      {subjects.map((subject, idx) => {
        const doneResult = results[idx];
        const done = idx < results.length;
        const isCurrent = idx === currentIndex && !done;
        const Icon = getSubjectIcon(subject.code);
        const percent =
          doneResult && doneResult.max_score && doneResult.max_score > 0
            ? Math.round(((doneResult.score ?? 0) / doneResult.max_score) * 100)
            : null;

        return (
          <div key={subject.code} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                done
                  ? "bg-emerald-500/90 text-white"
                  : isCurrent
                    ? "bg-white text-indigo-950 shadow"
                    : "bg-indigo-900/60 text-indigo-300"
              )}
            >
              {done ? (
                <CheckCircle2 className="size-3.5 shrink-0" />
              ) : (
                <Icon className="size-3.5 shrink-0" />
              )}
              <span>{subject.name}</span>
              {percent !== null ? <span className="opacity-80">· {percent}%</span> : null}
            </div>
            {idx < subjects.length - 1 ? (
              <ChevronRight className="size-3.5 shrink-0 text-indigo-500" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
