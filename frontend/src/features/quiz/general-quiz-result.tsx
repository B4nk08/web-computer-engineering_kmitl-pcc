"use client";

import { RotateCcw } from "lucide-react";
import type { ExternalQuizResultDto } from "./api";

const BAND_COPY: Record<string, string> = {
  high: "พร้อมเริ่มต้นได้ดี",
  fair: "พอไปได้ ควรเสริมบางจุด",
  prepare: "ควรเตรียมตัวเพิ่มก่อนลงเรียน",
  low: "เริ่มจากพื้นฐานก่อนจะช่วยได้มาก",
};

export function GeneralQuizResult({
  result,
  onRetake,
}: {
  result: ExternalQuizResultDto | null;
  onRetake: () => void;
}) {
  const percent = result?.percent ?? 0;
  const band = result?.band ? BAND_COPY[result.band] : null;

  return (
    <section className="relative flex min-h-svh flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="max-w-md text-xl font-semibold leading-relaxed text-[var(--navy-900)] sm:text-2xl">
        ความพร้อมสำหรับการเข้าเรียนวิศวกรรมคอมพิวเตอร์
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        ความพร้อมสำหรับสายนี้:{" "}
        <span className="font-semibold text-[var(--accent)]">{percent}%</span>
      </p>
      {band ? (
        <p className="mt-1 text-sm text-[var(--ink-soft)]">{band}</p>
      ) : null}

      <div className="mt-8 flex h-48 w-48 items-center justify-center rounded-xl border-4 border-[var(--accent)] text-xs text-[var(--ink-soft)] sm:h-56 sm:w-56">
        ใส่รูปมาสคอสตรงนี้
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0"
      >
        ทำแบบทดสอบอีกครั้ง
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}
