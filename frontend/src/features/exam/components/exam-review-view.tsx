"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Home,
  Loader2,
  Send,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatSeconds } from "../constants";
import type { StoredExamResult, StoredExamSession } from "../types";
import { ExamHeader } from "./exam-header";
import { ExamNavGrid } from "./exam-nav-grid";

type DialogPhase = "confirm" | "loading" | "result";

type ExamReviewViewProps = {
  session: StoredExamSession;
  participantName: string;
  remainingSeconds: number | null;
  elapsedSeconds: number;
  submitting: boolean;
  error: string | null;
  /** แถบแสดงหมวดหมู่ทั้งหมด (เฉพาะตอนสอบแบบ combo) — วางไว้เหนือ ExamHeader */
  stepper?: React.ReactNode;
  /** ข้อความบนปุ่มหลังเห็นคะแนนแล้ว เช่น "ไปข้อสอบหมวดถัดไป: IoT" — ถ้าไม่ส่งมาใช้ข้อความ default (กลับหน้าเลือกกลุ่ม) */
  nextLabel?: string;
  /** เรียกเมื่อกดปุ่มหลังเห็นคะแนน — ถ้าไม่ส่งมา จะ router.push("/exam") แทน */
  onResultContinue?: () => Promise<boolean> | boolean;
  onGoToQuestion: (questionId: string) => void;
  onBackToTaking: () => void;
  onSubmit: () => Promise<StoredExamResult | null>;
};

export function ExamReviewView({
  session,
  participantName,
  remainingSeconds,
  elapsedSeconds,
  submitting,
  error,
  stepper,
  nextLabel,
  onResultContinue,
  onGoToQuestion,
  onBackToTaking,
  onSubmit,
}: ExamReviewViewProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phase, setPhase] = useState<DialogPhase>("confirm");
  const [result, setResult] = useState<StoredExamResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = session.questions.length;
  const answered = Object.keys(session.answers).length;
  const unanswered = total - answered;

  function resetDialog() {
    setPhase("confirm");
    setResult(null);
    setSubmitError(null);
  }

  async function handleConfirmSubmit() {
    setPhase("loading");
    setSubmitError(null);
    const res = await onSubmit();
    if (res) {
      setResult(res);
      setPhase("result");
    } else {
      setPhase("confirm");
      setSubmitError("ส่งคำตอบไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  async function handleResultDone() {
    if (!onResultContinue) {
      setDialogOpen(false);
      router.push("/exam");
      return;
    }
    setPhase("loading");
    const ok = await onResultContinue();
    if (!ok) {
      // ไปหมวดถัดไปไม่สำเร็จ (เช่น ตั้งค่าข้อสอบหมวดถัดไปไม่ครบ) — กลับไปโชว์คะแนนเดิม ให้กดลองใหม่ได้
      setPhase("result");
      setSubmitError("ไปข้อสอบหมวดถัดไปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
    // ถ้าสำเร็จ: parent component จะ re-render ไปหน้าถัดไป/สรุปผลรวมเอง ไม่ต้องปิด dialog เอง
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      {stepper}
      <ExamHeader
        subjectName={session.subjectName}
        mode={session.mode}
        participantName={participantName}
        remainingSeconds={remainingSeconds}
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard value={String(answered)} label="ตอบแล้ว" tone="emerald" />
        <StatCard value={String(unanswered)} label="ไม่ตอบ" tone={unanswered > 0 ? "red" : "slate"} />
        <StatCard value={formatSeconds(elapsedSeconds)} label="เวลาที่ใช้" tone="slate" />
      </div>

      <div className="mt-5">
        <ExamNavGrid
          questions={session.questions}
          answers={session.answers}
          flagged={session.flagged}
          currentPage={session.currentPage}
          variant="review"
          onSelect={onGoToQuestion}
        />
      </div>

      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertTriangle className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBackToTaking}
          disabled={submitting || phase === "loading"}
        >
          <ArrowLeft className="size-4" />
          กลับไปแก้ไข
        </Button>

        <Dialog.Root
          open={dialogOpen}
          onOpenChange={(next) => {
            // กำลังคิดคะแนน / แสดงผลแล้ว — ห้ามปิด dialog ด้วยการคลิกข้างนอก
            if (phase === "loading" || phase === "result") return;
            setDialogOpen(next);
            if (!next) resetDialog();
          }}
        >
          <Dialog.Trigger asChild>
            <Button
              type="button"
              className="bg-indigo-950 hover:bg-indigo-900"
              disabled={submitting}
              onClick={() => {
                resetDialog();
                setDialogOpen(true);
              }}
            >
              <Send className="size-4" />
              ส่งคำตอบ
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none"
              onEscapeKeyDown={(e) => {
                if (phase === "loading" || phase === "result") e.preventDefault();
              }}
              onPointerDownOutside={(e) => {
                if (phase === "loading" || phase === "result") e.preventDefault();
              }}
            >
              {phase === "confirm" ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <Dialog.Title className="text-lg font-semibold text-slate-900">
                      ยืนยันส่งคำตอบ
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                        aria-label="ปิด"
                      >
                        <X className="size-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>
                      ตอบแล้ว{" "}
                      <span className="font-semibold text-emerald-600">{answered}</span> ข้อ จากทั้งหมด{" "}
                      {total} ข้อ
                    </p>
                    {unanswered > 0 ? (
                      <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-red-700">
                        <AlertTriangle className="size-4 shrink-0" />
                        ยังเหลือ {unanswered} ข้อที่ยังไม่ตอบ — ข้อที่ไม่ตอบจะถือว่าผิด
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                        <CheckCircle2 className="size-4 shrink-0" />
                        ตอบครบทุกข้อแล้ว
                      </p>
                    )}
                    <p>เมื่อส่งคำตอบแล้ว จะไม่สามารถกลับมาแก้ไขได้อีก</p>
                  </div>

                  {(submitError || error) && (
                    <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {submitError || error}
                    </p>
                  )}

                  <div className="mt-5 flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <Button type="button" variant="outline">
                        ยกเลิก
                      </Button>
                    </Dialog.Close>
                    <Button
                      type="button"
                      onClick={() => void handleConfirmSubmit()}
                      className="bg-indigo-950 hover:bg-indigo-900"
                    >
                      ยืนยันส่งคำตอบ
                    </Button>
                  </div>
                </>
              ) : null}

              {phase === "loading" ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Loader2 className="size-10 animate-spin text-indigo-700" />
                  <Dialog.Title className="text-lg font-semibold text-slate-900">
                    {result ? "กำลังเตรียมข้อสอบหมวดถัดไป..." : "กำลังตรวจคำตอบ..."}
                  </Dialog.Title>
                  <p className="text-sm text-slate-500">
                    {result ? "กรุณารอสักครู่" : "กรุณารอสักครู่ ระบบกำลังคำนวณคะแนน"}
                  </p>
                </div>
              ) : null}

              {phase === "result" && result ? (
                <ScorePopupBody
                  result={result}
                  doneLabel={nextLabel}
                  onDone={() => void handleResultDone()}
                  extraError={submitError}
                />
              ) : null}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

/** ใช้ตอนหมดเวลา auto-submit ด้วย — แสดงคะแนนใน popup */
export function ExamScoreResultDialog({
  open,
  result,
  doneLabel,
  onDone,
}: {
  open: boolean;
  result: StoredExamResult | null;
  doneLabel?: string;
  onDone: () => void;
}) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {result ? (
            <ScorePopupBody result={result} doneLabel={doneLabel} onDone={onDone} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 className="size-10 animate-spin text-indigo-700" />
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                หมดเวลาแล้ว — กำลังส่งคำตอบ...
              </Dialog.Title>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ScorePopupBody({
  result,
  doneLabel,
  extraError,
  onDone,
}: {
  result: StoredExamResult;
  doneLabel?: string;
  extraError?: string | null;
  onDone: () => void;
}) {
  const score = result.score ?? 0;
  const maxScore = result.max_score ?? 0;
  const hasScore = maxScore > 0;
  const percent = hasScore ? Math.round((score / maxScore) * 100) : null;
  const passed = percent !== null && percent >= 50;

  return (
    <div className="text-center">
      <div
        className={cn(
          "mx-auto flex size-14 items-center justify-center rounded-full",
          hasScore ? (passed ? "bg-emerald-50" : "bg-amber-50") : "bg-slate-100"
        )}
      >
        {hasScore ? (
          passed ? (
            <Trophy className="size-7 text-emerald-600" />
          ) : (
            <XCircle className="size-7 text-amber-600" />
          )
        ) : (
          <CheckCircle2 className="size-7 text-slate-500" />
        )}
      </div>

      <Dialog.Title className="mt-3 text-lg font-semibold text-slate-900">
        {hasScore ? "ผลคะแนนของคุณ" : "ส่งคำตอบเรียบร้อยแล้ว"}
      </Dialog.Title>
      <p className="mt-1 text-sm text-slate-500">{result.subjectName}</p>

      {hasScore ? (
        <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-5">
          <p className="text-sm font-medium text-indigo-700">คุณได้คะแนน</p>
          <p className="mt-1 text-4xl font-bold text-indigo-950">
            {Math.round(score)}
            <span className="text-xl font-medium text-indigo-400"> / {Math.round(maxScore)}</span>
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold",
              passed ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {percent}% · {passed ? "ผ่านเกณฑ์ 50%" : "ยังไม่ถึงเกณฑ์ 50%"}
          </p>
        </div>
      ) : null}

      {extraError ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-700">
          <AlertTriangle className="size-4 shrink-0" />
          {extraError}
        </p>
      ) : null}

      <Button className="mt-5 w-full bg-indigo-950 hover:bg-indigo-900" onClick={onDone}>
        <Home className="size-4" />
        {doneLabel ?? "กลับหน้าเลือกกลุ่มข้อสอบ"}
      </Button>
    </div>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "emerald" | "red" | "slate";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <div className={`rounded-2xl border px-4 py-4 text-center ${toneClass}`}>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs">{label}</p>
    </div>
  );
}
