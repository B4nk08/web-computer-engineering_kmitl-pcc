"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { QuizToast } from "./quiz-toast";
import type { QuizAnswers, QuizQuestion, ChoiceId } from "./types";

/**
 * quiz-flow.tsx
 * -------------
 * Component กลางที่ใช้ทำทั้ง 2 แบบทดสอบ (Quizz แนะนำสาย และ Quizz วัดความพร้อม)
 * รับผิดชอบ: หน้าแนะนำ (intro) -> ทำแบบทดสอบทีละข้อ พร้อม progress bar ->
 * ตรวจสอบว่าตอบครบหรือยัง -> เด้งแจ้งเตือน "กำลังประมวลผล/เรียบร้อย" ->
 * ส่งต่อคำตอบทั้งหมดให้ `renderResult` ของแต่ละหน้าคำนวณและแสดงผลเอง
 * (แต่ละควิซมีวิธีคำนวณผลต่างกัน จึงแยก renderResult ออกไปเป็น prop)
 */

interface QuizFlowProps {
  questions: QuizQuestion[];
  introQuote: string;
  introDescription: string[];
  renderResult: (args: {
    answers: QuizAnswers;
    questions: QuizQuestion[];
    onRetake: () => void;
  }) => React.ReactNode;
}

type Stage = "intro" | "quiz" | "result";

const PROCESSING_DELAY_MS = 900;
const DONE_DELAY_MS = 700;

export function QuizFlow({ questions, introQuote, introDescription, renderResult }: QuizFlowProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [missingIds, setMissingIds] = useState<number[] | null>(null);
  const [toastStatus, setToastStatus] = useState<"processing" | "done" | null>(null);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const progressPercent = useMemo(() => Math.round(((currentIndex + 1) / total) * 100), [currentIndex, total]);

  function reset() {
    setStage("intro");
    setCurrentIndex(0);
    setAnswers({});
    setMissingIds(null);
    setToastStatus(null);
  }

  function selectChoice(choiceId: ChoiceId) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choiceId }));
    setMissingIds(null);
  }

  function goPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    handleSubmit();
  }

  function handleSubmit() {
    const missing = questions.filter((q) => !answers[q.id]).map((q) => q.id);
    if (missing.length > 0) {
      setMissingIds(missing);
      // พาไปที่ข้อแรกที่ยังไม่ได้ตอบ เพื่อให้ผู้ใช้แก้ไขได้สะดวก
      const firstMissingIndex = questions.findIndex((q) => q.id === missing[0]);
      if (firstMissingIndex !== -1) setCurrentIndex(firstMissingIndex);
      return;
    }

    setToastStatus("processing");
    setTimeout(() => {
      setToastStatus("done");
      setTimeout(() => {
        setToastStatus(null);
        setStage("result");
      }, DONE_DELAY_MS);
    }, PROCESSING_DELAY_MS);
  }

  if (stage === "intro") {
    return (
      <section className="quiz-fade-in flex min-h-[70vh] items-center justify-center bg-white px-4 py-16">
        <div className="max-w-xl text-center">
          <p className="text-lg font-semibold leading-relaxed text-[var(--navy-900)] sm:text-xl">
            &ldquo;{introQuote}&rdquo;
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-[var(--ink-soft)]">
            {introDescription.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStage("quiz")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            เริ่มทำแบบทดสอบ
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  if (stage === "quiz") {
    const selected = answers[currentQuestion.id];

    return (
      <section className="quiz-fade-in flex min-h-[70vh] items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-xl">
          {/* แถบหัวข้อ + progress bar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-[var(--navy-900)]/20 px-4 py-1.5">
              <span className="whitespace-nowrap text-xs font-semibold text-[var(--navy-900)]">
                Question {currentIndex + 1} / {total}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--navy-900)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {toastStatus && <QuizToast status={toastStatus} />}
          </div>

          {/* การ์ดคำถาม */}
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              Question {currentIndex + 1}
            </p>
            <h2 className="mb-4 text-sm font-medium leading-relaxed text-[var(--ink)] sm:text-base">
              {currentIndex + 1}. {currentQuestion.text}
            </h2>

            <div className="space-y-2.5">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selected === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => selectChoice(choice.id)}
                    className={`flex w-full items-center gap-3 rounded-full border px-3 py-2.5 text-left text-xs transition-colors sm:text-sm ${
                      isSelected
                        ? "border-[var(--navy-900)] bg-[var(--navy-900)] text-white"
                        : "border-[var(--navy-900)]/25 bg-white text-[var(--ink)] hover:border-[var(--navy-900)]/60"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isSelected ? "bg-white text-[var(--navy-900)]" : "bg-[var(--navy-900)] text-white"
                      }`}
                    >
                      {choice.id}
                    </span>
                    <span className="leading-snug">{choice.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* แจ้งเตือนข้อที่ยังไม่ได้ตอบ */}
          {missingIds && missingIds.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>ยังไม่ได้ตอบข้อที่ {missingIds.join(", ")} กรุณาตอบให้ครบก่อนส่งคำตอบ</span>
            </div>
          )}

          {/* ปุ่มย้อนกลับ / ถัดไป / ส่งคำตอบ */}
          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--navy-900)] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              ย้อนกลับ
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 font-semibold text-[var(--navy-900)] transition-colors hover:text-[var(--accent)]"
            >
              {isLast ? "ส่งคำตอบ" : "ถัดไป"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // stage === "result"
  return <div className="quiz-fade-in">{renderResult({ answers, questions, onRetake: reset })}</div>;
}
