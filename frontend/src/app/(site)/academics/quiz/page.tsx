"use client";

import { useState } from "react";
import { LoadingRow } from "@/components/ui/loading-row";
import { isExternalQuizResult, submitQuizAttempt } from "@/features/quiz/api";
import type { ExternalQuizResultDto } from "@/features/quiz/api";
import { useActiveQuiz } from "@/features/quiz/hooks/use-active-quiz";
import { toPlayQuestions } from "@/features/quiz/play-questions";
import { QuizFlow } from "@/features/quiz/quiz-flow";
import { GeneralQuizResult } from "@/features/quiz/general-quiz-result";
import type { PlayAnswers } from "@/features/quiz/types";

export default function AcademicsQuizPage() {
  const { loading, error, quiz } = useActiveQuiz(
    "external",
    "ยังไม่มีแบบทดสอบวัดความพร้อมในระบบ",
  );
  const [result, setResult] = useState<ExternalQuizResultDto | null>(null);

  async function handleSubmit(answers: PlayAnswers) {
    if (!quiz) return;
    const attempt = await submitQuizAttempt(quiz.quiz.id, answers);
    setResult(isExternalQuizResult(attempt.result) ? attempt.result : null);
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
