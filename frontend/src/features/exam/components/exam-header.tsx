"use client";

import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSeconds } from "../constants";

type ExamHeaderProps = {
  subjectName: string;
  mode: string;
  participantName: string;
  remainingSeconds: number | null;
  progressLabel?: string;
  progressPercent?: number;
};

export function ExamHeader({
  subjectName,
  mode,
  participantName,
  remainingSeconds,
  progressLabel,
  progressPercent,
}: ExamHeaderProps) {
  const isLowTime = remainingSeconds !== null && remainingSeconds <= 5 * 60;

  return (
    <header className="rounded-2xl bg-indigo-950 px-4 py-3.5 text-white shadow-lg md:px-6 md:py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-300">
            {subjectName} · {mode === "real" ? "สอบจริง" : "ฝึกทำ"}
          </p>
          <h1 className="text-base font-semibold md:text-lg">สอบวัดระดับทางวิศวกรรมคอมพิวเตอร์</h1>
          <p className="mt-0.5 text-xs text-indigo-200">ผู้เข้าสอบ: {participantName}</p>
        </div>

        {remainingSeconds !== null ? (
          <div className="text-right">
            <p className="text-xs text-indigo-300">เวลาคงเหลือ</p>
            <p
              className={cn(
                "flex items-center gap-1.5 text-2xl font-bold tabular-nums",
                isLowTime ? "text-red-400" : "text-white"
              )}
            >
              <Timer className="size-5" />
              {formatSeconds(remainingSeconds)}
            </p>
          </div>
        ) : null}
      </div>

      {progressLabel ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span>{progressLabel}</span>
            {progressPercent !== undefined ? <span>{Math.round(progressPercent)}%</span> : null}
          </div>
          {progressPercent !== undefined ? (
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-indigo-900">
              <div
                className="h-full rounded-full bg-sky-400 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
