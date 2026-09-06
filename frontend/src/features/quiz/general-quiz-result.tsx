"use client";

import { RotateCcw } from "lucide-react";
import type { QuizAnswers, QuizQuestion } from "./types";

/**
 * general-quiz-result.tsx
 * -------------------------
 * หน้าผลลัพธ์ของ "Quizz วัดความพร้อม": รวมคะแนน weight ของคำตอบทั้งหมด
 * แล้วคิดเป็นเปอร์เซ็นต์เทียบกับคะแนนเต็มที่เป็นไปได้ (แต่ละข้อ weight สูงสุด 3)
 */
export function GeneralQuizResult({
  answers,
  questions,
  onRetake,
}: {
  answers: QuizAnswers;
  questions: QuizQuestion[];
  onRetake: () => void;
}) {
  let totalScore = 0;
  let maxScore = 0;
  for (const question of questions) {
    const questionMax = Math.max(...question.choices.map((c) => c.weight ?? 0));
    maxScore += questionMax;

    const choiceId = answers[question.id];
    const choice = question.choices.find((c) => c.id === choiceId);
    totalScore += choice?.weight ?? 0;
  }
  const percent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-16 text-center">
      <h1 className="max-w-md text-xl font-semibold leading-relaxed text-[var(--navy-900)] sm:text-2xl">
        ความพร้อมสำหรับการเข้าเรียนวิศวกรรมคอมพิวเตอร์
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        ความพร้อมสำหรับสายนี้: <span className="font-semibold text-[var(--accent)]">{percent}%</span>
      </p>

      {/* ช่องใส่รูปมาสคอส — เว้นว่างไว้ก่อน จะเพิ่มรูปเองภายหลัง */}
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
