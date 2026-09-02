"use client";

import { CheckCircle2, Home, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoredComboResult } from "../types";

type ComboResultViewProps = {
  summary: StoredComboResult;
  onDone: () => void;
};

/** สรุปผลคะแนนรวมหลังทำครบทุกหมวดหมู่ — แสดงค่าเฉลี่ยรวม + breakdown รายหมวด */
export function ComboResultView({ summary, onDone }: ComboResultViewProps) {
  const percent = summary.averagePercent !== null ? Math.round(summary.averagePercent) : null;
  const passed = percent !== null && percent >= 50;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#0b1338_0%,_#151c4a_45%,_#1c2560_100%)] px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div
            className={cn(
              "mx-auto flex size-16 items-center justify-center rounded-full",
              percent === null ? "bg-slate-100" : passed ? "bg-emerald-50" : "bg-amber-50"
            )}
          >
            {percent === null ? (
              <CheckCircle2 className="size-8 text-slate-500" />
            ) : passed ? (
              <Trophy className="size-8 text-emerald-600" />
            ) : (
              <XCircle className="size-8 text-amber-600" />
            )}
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">ผลคะแนนรวมทุกหมวดหมู่</h1>
          <p className="mt-1 text-sm text-slate-500">สอบครบ {summary.results.length} หมวดหมู่แล้ว</p>
        </div>

        <div className="mt-6 rounded-2xl bg-indigo-50 px-6 py-7 text-center">
          <p className="text-sm font-medium text-indigo-700">คะแนนเฉลี่ยรวม</p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-indigo-950">
            {percent ?? "-"}
            <span className="text-2xl font-medium text-indigo-400">%</span>
          </p>
          {percent !== null ? (
            <p
              className={cn(
                "mt-2 text-base font-semibold",
                passed ? "text-emerald-600" : "text-amber-600"
              )}
            >
              {Math.round(summary.totalScore)}/{Math.round(summary.totalMaxScore)} ข้อ ·{" "}
              {passed ? "ผ่านเกณฑ์ 50%" : "ยังไม่ถึงเกณฑ์ 50%"}
            </p>
          ) : null}
        </div>

        <div className="mt-5 space-y-2">
          {summary.results.map((r) => {
            const p =
              r.max_score && r.max_score > 0
                ? Math.round(((r.score ?? 0) / r.max_score) * 100)
                : null;
            return (
              <div
                key={r.subjectCode}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{r.subjectName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">
                    {Math.round(r.score ?? 0)}/{Math.round(r.max_score ?? 0)}
                  </span>
                  {p !== null ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        p >= 50 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {p}%
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <Button className="mt-6 w-full bg-indigo-950 hover:bg-indigo-900" onClick={onDone}>
          <Home className="size-4" />
          กลับหน้าหลัก
        </Button>
      </div>
    </main>
  );
}
