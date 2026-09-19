"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { RequireMember } from "@/components/layout/require-member";
import { ApiError } from "@/lib/api";
import {
  isInternalQuizResult,
  listQuizzes,
  playQuiz,
  submitQuizAttempt,
} from "@/features/quiz/api";
import type { InternalQuizResultDto, QuizPlayDto } from "@/features/quiz/api";
import { QuizFlow } from "@/features/quiz/quiz-flow";
import { StudentQuizResult } from "@/features/quiz/student-quiz-result";
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

function InternalQuizRecommend() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizPlayDto | null>(null);
  const [result, setResult] = useState<InternalQuizResultDto | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listQuizzes("internal", { isActive: true })
      .then((items) => {
        const active = items[0];
        if (!active) {
          throw new Error("ยังไม่มีแบบทดสอบแนะนำสายในระบบ");
        }
        return playQuiz(active.id);
      })
      .then((data) => {
        if (!alive) return;
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
    setResult(isInternalQuizResult(attempt.result) ? attempt.result : null);
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
      introQuote="เรียนมาสักพักแล้ว แต่ยังไม่รู้จะไปทางไหนดี มารวมกันตรงนี้"
      introDescription={[
        "ประมาณ 5–8 นาที เพื่อดูว่าคุณเอียงไปทางซอฟต์แวร์ IoT เครือข่าย หรือข้อมูล",
        "ผลเป็นแนวทางจากคำตอบ ไม่ใช่การันตีอาชีพ ระบบจะแนะนำอาชีพตัวอย่างในกลุ่มที่ได้คะแนนสูงสุด",
      ]}
      onSubmit={handleSubmit}
      renderResult={({ onRetake }) => (
        <StudentQuizResult
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

export default function StudentQuizRecommendPage() {
  return (
    <RequireMember description="แบบทดสอบแนะนำสายสำหรับนักศึกษาและบุคลากรสาขาที่เข้าสู่ระบบแล้ว">
      <InternalQuizRecommend />
    </RequireMember>
  );
}
