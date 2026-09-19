"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  isExternalQuizResult,
  listQuizzes,
  playQuiz,
  submitQuizAttempt,
} from "@/features/quiz/api";
import type { ExternalQuizResultDto, QuizPlayDto } from "@/features/quiz/api";
import { QuizFlow } from "@/features/quiz/quiz-flow";
import { GeneralQuizResult } from "@/features/quiz/general-quiz-result";
import type { PlayAnswers, PlayQuestion } from "@/features/quiz/types";

function toPlayQuestions(quiz: QuizPlayDto): PlayQuestion[] {
  return quiz.questions.map((question) => ({
    id: question.id,
    text: question.prompt,
    choices: question.options.map((option) => ({
      id: option.id,
      text: option.label,
    })),
  }));
}

export default function AcademicsQuizPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizPlayDto | null>(null);
  const [result, setResult] = useState<ExternalQuizResultDto | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listQuizzes("external", { isActive: true })
      .then((items) => {
        const active = items[0];
        if (!active) {
          throw new Error("ยังไม่มีแบบทดสอบวัดความพร้อมในระบบ");
        }
        return playQuiz(active.id);
      })
      .then((data) => {
        if (!alive) return;
        if (data.questions.length === 0) {
          throw new Error("ยังไม่มีคำถามในแบบทดสอบวัดความพร้อม");
        }
        setQuiz(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "โหลดแบบทดสอบไม่สำเร็จ",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(answers: PlayAnswers) {
    if (!quiz) return;
    const attempt = await submitQuizAttempt(quiz.quiz.id, answers);
    setResult(isExternalQuizResult(attempt.result) ? attempt.result : null);
  }

  if (loading) {
    return (
      <section className="flex min-h-svh flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
        <span className="ml-2 text-sm text-[var(--ink-soft)]">
          กำลังโหลดแบบทดสอบ...
        </span>
      </section>
    );
  }

  if (error || !quiz) {
    return (
      <section className="flex min-h-svh flex-1 items-center justify-center px-4">
        <p className="text-sm text-[var(--ink-soft)]">
          {error ?? "ยังไม่มีแบบทดสอบ"}
        </p>
      </section>
    );
  }

  return (
    <QuizFlow
      questions={toPlayQuestions(quiz)}
      introQuote="อยากเรียนวิศวกรรมคอมพิวเตอร์ แต่ไม่รู้ว่าพร้อมหรือยัง ให้เราช่วยคุณ"
      introDescription={[
        "ไม่ต้องกังวลถ้ายังไม่มีพื้นฐานแน่น เช็กความพร้อมของคุณก่อนลงสนามจริง",
        "ทำแบบทดสอบเพื่อค้นหาว่าคุณเหมาะกับวิศวคอม แค่ไหน",
        "พร้อมคำแนะนำทักษะที่ควรเติมเต็มก่อนเริ่มต้น",
      ]}
      onSubmit={handleSubmit}
      renderResult={({ onRetake }) => (
        <GeneralQuizResult
          result={result}
          onRetake={() => {
            setResult(null);
            onRetake();
          }}
        />
      )}
    />
  );
}
