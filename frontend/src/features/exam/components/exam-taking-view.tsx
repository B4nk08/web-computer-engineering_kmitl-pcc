"use client";

import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTIONS_PER_PAGE } from "../constants";
import type { StoredExamSession } from "../types";
import { ExamHeader } from "./exam-header";
import { ExamNavGrid } from "./exam-nav-grid";
import { ExamQuestionCard } from "./exam-question-card";

type ExamTakingViewProps = {
  session: StoredExamSession;
  participantName: string;
  remainingSeconds: number | null;
  totalPages: number;
  /** แถบแสดงหมวดหมู่ทั้งหมด (เฉพาะตอนสอบแบบ combo) — วางไว้เหนือ ExamHeader */
  stepper?: React.ReactNode;
  onAnswer: (questionId: string, choiceKey: string) => void;
  onToggleFlag: (questionId: string) => void;
  onGoToPage: (page: number) => void;
  onGoToQuestion: (questionId: string) => void;
  onReview: () => void;
};

export function ExamTakingView({
  session,
  participantName,
  remainingSeconds,
  totalPages,
  stepper,
  onAnswer,
  onToggleFlag,
  onGoToPage,
  onGoToQuestion,
  onReview,
}: ExamTakingViewProps) {
  const start = session.currentPage * QUESTIONS_PER_PAGE;
  const end = Math.min(start + QUESTIONS_PER_PAGE, session.questions.length);
  const pageQuestions = session.questions.slice(start, end);
  const answeredCount = Object.keys(session.answers).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      {stepper}
      <ExamHeader
        subjectName={session.subjectName}
        mode={session.mode}
        participantName={participantName}
        remainingSeconds={remainingSeconds}
        progressLabel={`Question ${answeredCount}/${session.questions.length} ตอบแล้ว · หน้า ${session.currentPage + 1}/${totalPages} ข้อ ${start + 1}-${end}`}
        progressPercent={(answeredCount / Math.max(1, session.questions.length)) * 100}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          {pageQuestions.map((question, idx) => (
            <ExamQuestionCard
              key={question.id}
              question={question}
              index={start + idx}
              selectedKey={session.answers[question.id]}
              flagged={session.flagged.includes(question.id)}
              onAnswer={(key) => onAnswer(question.id, key)}
              onToggleFlag={() => onToggleFlag(question.id)}
            />
          ))}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={session.currentPage === 0}
              onClick={() => onGoToPage(session.currentPage - 1)}
            >
              <ChevronLeft className="size-4" />
              หน้าก่อนหน้า
            </Button>

            {session.currentPage === totalPages - 1 ? (
              <Button type="button" onClick={onReview} className="bg-indigo-950 hover:bg-indigo-900">
                <Send className="size-4" />
                ตรวจสอบก่อนส่ง
              </Button>
            ) : (
              <Button type="button" onClick={() => onGoToPage(session.currentPage + 1)}>
                หน้าถัดไป
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ExamNavGrid
            questions={session.questions}
            answers={session.answers}
            flagged={session.flagged}
            currentPage={session.currentPage}
            variant="taking"
            onSelect={onGoToQuestion}
          />
          <Button type="button" variant="outline" className="mt-3 w-full" onClick={onReview}>
            ไปหน้าตรวจสอบคำตอบ
          </Button>
        </div>
      </div>
    </div>
  );
}
