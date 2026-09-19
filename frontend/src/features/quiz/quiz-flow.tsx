"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { QuizToast } from "./quiz-toast";
import type { PlayAnswers, PlayQuestion } from "./types";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

interface QuizFlowProps {
  questions: PlayQuestion[];
  introQuote: string;
  introDescription: string[];
  onSubmit?: (answers: PlayAnswers) => Promise<void>;
  renderResult: (args: {
    answers: PlayAnswers;
    onRetake: () => void;
  }) => React.ReactNode;
}

type Stage = "intro" | "quiz" | "result";

const DONE_DELAY_MS = 700;

export function QuizFlow({
  questions,
  introQuote,
  introDescription,
  onSubmit,
  renderResult,
}: QuizFlowProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PlayAnswers>({});
  const [missingIndexes, setMissingIndexes] = useState<number[] | null>(null);
  const [toastStatus, setToastStatus] = useState<"processing" | "done" | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const progressPercent = useMemo(
    () => (total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0),
    [currentIndex, total],
  );

  function reset() {
    setStage("intro");
    setCurrentIndex(0);
    setAnswers({});
    setMissingIndexes(null);
    setToastStatus(null);
    setSubmitError(null);
  }

  function selectChoice(choiceId: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choiceId }));
    setMissingIndexes(null);
    setSubmitError(null);
  }

  function goPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    void handleSubmit();
  }

  async function handleSubmit() {
    const missing = questions
      .map((q, index) => (answers[q.id] ? -1 : index + 1))
      .filter((n) => n > 0);
    if (missing.length > 0) {
      setMissingIndexes(missing);
      const firstMissingIndex = questions.findIndex((q) => !answers[q.id]);
      if (firstMissingIndex !== -1) setCurrentIndex(firstMissingIndex);
      return;
    }

    setSubmitError(null);
    setToastStatus("processing");
    try {
      if (onSubmit) {
        await onSubmit(answers);
      }
      setToastStatus("done");
      setTimeout(() => {
        setToastStatus(null);
        setStage("result");
      }, DONE_DELAY_MS);
    } catch (err) {
      setToastStatus(null);
      setSubmitError(err instanceof Error ? err.message : "ส่งคำตอบไม่สำเร็จ");
    }
  }

  if (stage === "intro") {
    return (
      <section className="quiz-fade-in flex min-h-svh flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-4xl text-center">
          <p className="text-balance text-xl font-semibold leading-snug text-[var(--navy-900)] underline decoration-[var(--navy-900)] decoration-1 underline-offset-[10px] sm:text-2xl lg:text-[1.7rem]">
            &ldquo;{introQuote}&rdquo;
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-sm font-medium leading-relaxed text-[var(--navy-900)] sm:text-[15px]">
            &ldquo;{" "}
            {introDescription.map((line, i) => (
              <span key={i}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}{" "}
            &rdquo;
          </p>
          <button
            type="button"
            onClick={() => setStage("quiz")}
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            เริ่มทำแบบทดสอบ
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  if (stage === "quiz" && currentQuestion) {
    const selected = answers[currentQuestion.id];

    return (
      <section className="quiz-fade-in quiz-question-bg flex min-h-svh flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-[var(--navy-900)]/20 px-5 py-2">
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

          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5 sm:p-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              Question {currentIndex + 1}
            </p>
            <h2 className="mb-6 text-sm font-medium leading-relaxed text-[var(--ink)] sm:text-base">
              {currentIndex + 1}. {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => {
                const isSelected = selected === choice.id;
                const letter = CHOICE_LETTERS[index] ?? String(index + 1);
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => selectChoice(choice.id)}
                    className={`flex w-full items-center gap-3 rounded-full border px-4 py-3.5 text-left text-xs transition-colors sm:text-sm ${
                      isSelected
                        ? "border-[var(--navy-900)] bg-[var(--navy-900)] text-white"
                        : "border-[var(--navy-900)]/25 bg-white text-[var(--ink)] hover:border-[var(--navy-900)]/60"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isSelected
                          ? "bg-white text-[var(--navy-900)]"
                          : "bg-[var(--navy-900)] text-white"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="leading-snug">{choice.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {missingIndexes && missingIndexes.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                ยังไม่ได้ตอบข้อที่ {missingIndexes.join(", ")}{" "}
                กรุณาตอบให้ครบก่อนส่งคำตอบ
              </span>
            </div>
          )}
          {submitError ? (
            <p className="mt-3 text-xs text-red-600">{submitError}</p>
          ) : null}

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
              disabled={toastStatus === "processing"}
              className="flex items-center gap-1 font-semibold text-[var(--navy-900)] transition-colors hover:text-[var(--accent)] disabled:opacity-50"
            >
              {isLast ? "ส่งคำตอบ" : "ถัดไป"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="quiz-fade-in">
      {renderResult({ answers, onRetake: reset })}
    </div>
  );
}
