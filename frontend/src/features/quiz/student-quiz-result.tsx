"use client";

import { RotateCcw } from "lucide-react";
import { TRACK_LABELS } from "./data/tracks";
import type { QuizAnswers, QuizQuestion } from "./types";

/**
 * student-quiz-result.tsx
 * -------------------------
 * หน้าผลลัพธ์ของ "Quizz แนะนำสาย": นับคะแนนโหวตของแต่ละ trackTag จากคำตอบ
 * ทั้งหมด แล้วแสดงสายที่ได้คะแนนมากที่สุด พร้อม % ความเหมาะสม
 * (คะแนน% = จำนวนข้อที่โหวตให้สายนั้น / จำนวนคำถามทั้งหมด x 100)
 */
export function StudentQuizResult({
  answers,
  questions,
  onRetake,
}: {
  answers: QuizAnswers;
  questions: QuizQuestion[];
  onRetake: () => void;
}) {
  const tally: Record<string, number> = {};
  for (const question of questions) {
    const choiceId = answers[question.id];
    const choice = question.choices.find((c) => c.id === choiceId);
    if (choice?.trackTag) {
      tally[choice.trackTag] = (tally[choice.trackTag] ?? 0) + 1;
    }
  }

  const [topTrackTag, topCount] = Object.entries(tally).sort((a, b) => b[1] - a[1])[0] ?? ["software", 0];
  const percent = questions.length > 0 ? Math.round((topCount / questions.length) * 100) : 0;
  const trackLabel = TRACK_LABELS[topTrackTag] ?? topTrackTag;

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-16 text-center">
      <p className="text-sm font-medium text-[var(--ink-soft)]">สายที่ใช่สำหรับคุณคือ</p>
      <h1 className="mt-1 text-2xl font-semibold text-[var(--navy-900)] sm:text-3xl">{trackLabel}</h1>

      {/* ช่องใส่รูปมาสคอส — จะเพิ่มรูปเองภายหลัง */}
      <div className="mt-8 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--navy-900)]/20 text-xs text-[var(--ink-soft)] sm:h-56 sm:w-56">
        ใส่รูปมาสคอสตรงนี้
      </div>

      <p className="mt-6 text-sm font-medium text-[var(--ink)]">
        ความเหมาะสม: <span className="font-semibold text-[var(--accent)]">{percent}%</span>
      </p>

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
