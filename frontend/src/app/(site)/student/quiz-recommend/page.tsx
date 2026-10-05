"use client";

import { useState } from "react";
import { RequireMember } from "@/components/layout/require-member";
import { LoadingRow } from "@/components/ui/loading-row";
import { isInternalQuizResult, submitQuizAttempt } from "@/features/quiz/api";
import type { InternalQuizResultDto } from "@/features/quiz/api";
import { useActiveQuiz } from "@/features/quiz/hooks/use-active-quiz";
import { toPlayQuestions } from "@/features/quiz/play-questions";
import { QuizFlow } from "@/features/quiz/quiz-flow";
import { StudentQuizResult } from "@/features/quiz/student-quiz-result";
import type { PlayAnswers } from "@/features/quiz/types";

function InternalQuizRecommend() {
  const { loading, error, quiz } = useActiveQuiz(
    "internal",
    "ยังไม่มีแบบทดสอบแนะนำสายในระบบ",
  );
  const [result, setResult] = useState<InternalQuizResultDto | null>(null);

  async function handleSubmit(answers: PlayAnswers) {
    if (!quiz) return;
    const attempt = await submitQuizAttempt(quiz.quiz.id, answers);
    setResult(isInternalQuizResult(attempt.result) ? attempt.result : null);
  }

  if (loading) {
    return (
      <section className="flex min-h-svh flex-1 items-center justify-center">
        <LoadingRow label="กำลังโหลดแบบทดสอบ..." />
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
        "ใช้เวลาประมาณ 5–8 นาที ตอบตามที่คิด แล้วดูว่าคุณเข้ากับสายไหนมากที่สุด",
        "ผลเป็นแค่แนวทาง จะมีตัวอย่างอาชีพในสายนั้นให้ดูต่อ ไม่ได้การันตีอาชีพ",
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
