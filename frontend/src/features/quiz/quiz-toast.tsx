"use client";

import { Loader2, CheckCircle2 } from "lucide-react";

/**
 * quiz-toast.tsx
 * ---------------
 * แจ้งเตือนเล็กๆ มุมบนของการ์ดคำถาม ใช้ตอน "กำลังประมวลผล..." และ
 * "ประมวลผลเรียบร้อย" หลังกดส่งคำตอบข้อสุดท้าย (ตามภาพตัวอย่าง)
 */
export function QuizToast({ status }: { status: "processing" | "done" }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--ink-soft)] shadow-md ring-1 ring-black/5">
      {status === "processing" ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />
          กำลังประมวลผล...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ประมวลผลเรียบร้อย
        </>
      )}
    </div>
  );
}
