"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useComboExamSession } from "../hooks/use-combo-exam-session";
import type { StoredExamResult } from "../types";
import { ComboResultView } from "./combo-result-view";
import { ComboStepper } from "./combo-stepper";
import { ExamReviewView, ExamScoreResultDialog } from "./exam-review-view";
import { ExamTakingView } from "./exam-taking-view";

export function ExamSessionView() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    session,
    loading,
    submitting,
    error,
    remainingSeconds,
    elapsedSeconds,
    totalPages,
    answer,
    toggleFlag,
    goToPage,
    goToQuestion,
    setStep,
    submit,
    comboSubjects,
    comboIndex,
    comboResults,
    isLastSubject,
    nextSubjectName,
    comboFinalSummary,
    continueCombo,
  } = useComboExamSession();

  const autoSubmitted = useRef(false);
  const timeoutContinuing = useRef(false);
  const [timeoutResult, setTimeoutResult] = useState<StoredExamResult | null>(null);
  const [timeoutDialogOpen, setTimeoutDialogOpen] = useState(false);
  const [timeoutTransitionError, setTimeoutTransitionError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session && !comboFinalSummary && !timeoutDialogOpen) {
      router.replace("/exam");
    }
  }, [loading, session, comboFinalSummary, timeoutDialogOpen, router]);

  useEffect(() => {
    if (autoSubmitted.current) return;
    if (!session || remainingSeconds === null) return;
    if (remainingSeconds > 0) return;
    autoSubmitted.current = true;
    setTimeoutDialogOpen(true);
    void submit().then((res) => {
      if (res) {
        setTimeoutResult(res);
      } else {
        setTimeoutDialogOpen(false);
      }
    });
  }, [remainingSeconds, session, submit]);

  async function handleTimeoutDone() {
    if (timeoutContinuing.current) return;
    timeoutContinuing.current = true;
    setTimeoutTransitionError(null);
    const ok = await continueCombo();
    timeoutContinuing.current = false;
    if (!ok) {
      setTimeoutTransitionError("ไปข้อสอบหมวดถัดไปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return;
    }
    setTimeoutDialogOpen(false);
    setTimeoutResult(null);
    autoSubmitted.current = false;
  }

  if (comboFinalSummary) {
    return (
      <ComboResultView
        summary={comboFinalSummary}
        onDone={() => router.push("/exam")}
      />
    );
  }

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        <Loader2 className="mr-2 size-4 animate-spin" />
        กำลังโหลดข้อสอบ...
        <ExamScoreResultDialog
          open={timeoutDialogOpen}
          result={timeoutResult}
          doneLabel={isLastSubject ? "ดูผลสรุปคะแนนทั้งหมด" : `ไปข้อสอบหมวดถัดไป: ${nextSubjectName ?? ""}`}
          onDone={() => void handleTimeoutDone()}
        />
      </div>
    );
  }

  const participantName = user?.displayName || user?.email || "ผู้เข้าสอบ";
  const stepper =
    comboSubjects.length > 1 ? (
      <ComboStepper subjects={comboSubjects} currentIndex={comboIndex} results={comboResults} />
    ) : null;

  return (
    <main className="min-h-screen bg-slate-100">
      {session.step === "review" ? (
        <ExamReviewView
          session={session}
          stepper={stepper}
          participantName={participantName}
          remainingSeconds={remainingSeconds}
          elapsedSeconds={elapsedSeconds}
          submitting={submitting}
          error={error}
          nextLabel={isLastSubject ? "ดูผลสรุปคะแนนทั้งหมด" : `ไปข้อสอบหมวดถัดไป: ${nextSubjectName ?? ""}`}
          onResultContinue={continueCombo}
          onGoToQuestion={goToQuestion}
          onBackToTaking={() => setStep("taking")}
          onSubmit={submit}
        />
      ) : (
        <ExamTakingView
          session={session}
          stepper={stepper}
          participantName={participantName}
          remainingSeconds={remainingSeconds}
          totalPages={totalPages}
          onAnswer={answer}
          onToggleFlag={toggleFlag}
          onGoToPage={goToPage}
          onGoToQuestion={goToQuestion}
          onReview={() => setStep("review")}
        />
      )}

      <ExamScoreResultDialog
        open={timeoutDialogOpen}
        result={timeoutResult}
        doneLabel={isLastSubject ? "ดูผลสรุปคะแนนทั้งหมด" : `ไปข้อสอบหมวดถัดไป: ${nextSubjectName ?? ""}`}
        onDone={() => void handleTimeoutDone()}
      />
      {timeoutTransitionError && timeoutDialogOpen ? (
        <p className="fixed inset-x-0 bottom-6 z-[60] mx-auto w-fit rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-lg">
          {timeoutTransitionError}
        </p>
      ) : null}
    </main>
  );
}
