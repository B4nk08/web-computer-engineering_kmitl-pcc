"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Home, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoredExamResult } from "../types";

type ExamResultViewProps = {
  result: StoredExamResult;
};

function toScore(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function ExamResultView({ result }: ExamResultViewProps) {
  const router = useRouter();
  const score = toScore(result.score);
  const maxScore = toScore(result.max_score);
  const hasScore = score !== null && maxScore !== null && maxScore > 0;
  const percent = hasScore ? Math.round((score! / maxScore!) * 100) : null;
  const passed = percent !== null && percent >= 50;
  const questionCount = result.question_count ?? maxScore ?? null;
  const answeredCount = result.answered_count;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#0b1338_0%,_#151c4a_45%,_#1c2560_100%)] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div
          className={cn(
            "mx-auto flex size-16 items-center justify-center rounded-full",
            hasScore ? (passed ? "bg-emerald-50" : "bg-amber-50") : "bg-slate-100"
          )}
        >
          {hasScore ? (
            passed ? (
              <Trophy className="size-8 text-emerald-600" />
            ) : (
              <XCircle className="size-8 text-amber-600" />
            )
          ) : (
            <CheckCircle2 className="size-8 text-slate-500" />
          )}
        </div>

        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          {hasScore ? "ผลคะแนนของคุณ" : "ส่งคำตอบเรียบร้อยแล้ว"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {result.subjectName} · {result.mode === "real" ? "สอบจริง" : "ฝึกทำ (Mock)"}
        </p>

        {hasScore ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-indigo-50 px-6 py-7">
              <p className="text-sm font-medium text-indigo-700">คุณได้คะแนน</p>
              <p className="mt-1 text-5xl font-bold tracking-tight text-indigo-950">
                {Math.round(score!)}
                <span className="text-2xl font-medium text-indigo-400">
                  {" "}
                  / {Math.round(maxScore!)}
                </span>
              </p>
              <p
                className={cn(
                  "mt-2 text-base font-semibold",
                  passed ? "text-emerald-600" : "text-amber-600"
                )}
              >
                {percent}% · {passed ? "ผ่านเกณฑ์ 50%" : "ยังไม่ถึงเกณฑ์ 50%"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 px-3 py-3">
                <p className="text-xs text-slate-500">ตอบถูก</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {Math.round(score!)} ข้อ
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 px-3 py-3">
                <p className="text-xs text-slate-500">ทั้งหมด</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {Math.round(questionCount!)} ข้อ
                </p>
              </div>
            </div>

            {answeredCount !== undefined ? (
              <p className="text-xs text-slate-500">
                คุณตอบไป {answeredCount} จาก {questionCount} ข้อ
                {answeredCount < (questionCount ?? 0)
                  ? " (ข้อที่ไม่ตอบนับเป็นผิด)"
                  : ""}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            ส่งคำตอบสำเร็จแล้ว แต่ระบบยังไม่ส่งคะแนนกลับมา
            ลองรีเฟรชหน้า หรือสอบใหม่อีกครั้ง
          </div>
        )}

        <Button
          className="mt-6 w-full bg-indigo-950 hover:bg-indigo-900"
          onClick={() => router.push("/exam")}
        >
          <Home className="size-4" />
          กลับหน้าเลือกกลุ่มข้อสอบ
        </Button>
      </div>
    </main>
  );
}
