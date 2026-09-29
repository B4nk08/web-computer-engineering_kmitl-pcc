"use client";

import { RotateCcw } from "lucide-react";
import type { ExternalQuizResultDto } from "./api";

const BAND_COPY: Record<string, string> = {
  high: "พร้อมเริ่มต้นได้ดี",
  fair: "พอไปได้ ควรเสริมบางจุด",
  prepare: "ควรเตรียมตัวเพิ่มก่อนลงเรียน",
  low: "เริ่มจากพื้นฐานก่อนจะช่วยได้มาก",
};

const BAND_HINT: Record<string, string> = {
  high: "พื้นฐานพอเดินต่อได้ ลองสำรวจสายที่สนใจต่อได้เลย",
  fair: "มีจุดที่ควรเติม ลองทบทวนวิชาพื้นฐานและฝึกทำโจทย์เพิ่ม",
  prepare: "แนะนำเติมพื้นฐานคณิต ตรรกะ และการเขียนโปรแกรมก่อน",
  low: "เริ่มจากพื้นฐานช้า ๆ จะช่วยให้มั่นใจขึ้นเมื่อเข้าเรียนจริง",
};

export function GeneralQuizResult({
  result,
  onRetake,
}: {
  result: ExternalQuizResultDto | null;
  onRetake: () => void;
}) {
  const percent = Math.round(result?.percent ?? 0);
  const bandKey = result?.band ?? null;
  const band = bandKey ? BAND_COPY[bandKey] : null;
  const hint = bandKey ? BAND_HINT[bandKey] : null;
  const ring = Math.min(100, Math.max(0, percent));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - ring / 100);

  return (
    <section className="quiz-fade-in relative flex min-h-svh flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-[var(--ink-soft)]">
        ผลแบบทดสอบวัดความพร้อม
      </p>
      <h1 className="mt-2 max-w-lg text-xl font-semibold leading-snug tracking-tight text-[var(--navy-900)] sm:text-2xl">
        ความพร้อมสำหรับการเข้าเรียน
        <br className="hidden sm:block" />
        วิศวกรรมคอมพิวเตอร์
      </h1>

      <div className="relative mt-8 flex size-36 items-center justify-center sm:size-40">
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 size-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="7"
            opacity="0.55"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--navy-900)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="relative z-10">
          <p className="text-4xl font-semibold tabular-nums tracking-tight text-[var(--navy-900)] sm:text-5xl">
            {percent}
            <span className="ml-0.5 text-xl font-medium text-[var(--ink-soft)] sm:text-2xl">
              %
            </span>
          </p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--ink-soft)]">
            ความพร้อม
          </p>
        </div>
      </div>

      {band ? (
        <p className="mt-6 text-base font-semibold text-[var(--navy-900)] sm:text-lg">
          {band}
        </p>
      ) : null}
      {hint ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
          {hint}
        </p>
      ) : null}

      {typeof result?.score === "number" && typeof result?.max_score === "number" ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          ได้ {result.score} จาก {result.max_score} คะแนน
          {typeof result.question_count === "number"
            ? ` · จาก ${result.question_count} ข้อ`
            : null}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onRetake}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0"
      >
        ทำแบบทดสอบอีกครั้ง
        <RotateCcw className="h-4 w-4" />
      </button>
    </section>
  );
}
