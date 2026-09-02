"use client";

import { useRouter } from "next/navigation";
import { AlarmClockCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearActiveExamSession,
  clearComboSession,
  loadActiveExamSession,
  loadComboSession,
} from "../lib/storage";

type ResumeBannerProps = {
  onDismiss: () => void;
};

/** แจ้งเตือนตอนมี attempt ที่ยังทำไม่จบค้างอยู่ (เช่น refresh หน้าหรือปิด tab ไปกลางทาง) */
export function ResumeBanner({ onDismiss }: ResumeBannerProps) {
  const router = useRouter();
  const session = loadActiveExamSession();
  if (!session) return null;
  const combo = loadComboSession();
  const comboLabel =
    combo && combo.subjects.length > 1
      ? ` (หมวดที่ ${combo.currentIndex + 1}/${combo.subjects.length})`
      : "";

  return (
    <div className="mb-6 flex w-full max-w-md items-center gap-3 rounded-2xl border border-amber-300/40 bg-amber-500/15 px-4 py-3 text-amber-100 shadow-lg backdrop-blur">
      <AlarmClockCheck className="size-5 shrink-0" />
      <p className="flex-1 text-sm">
        คุณมีการสอบ <span className="font-semibold">{session.subjectName}</span>
        {comboLabel} ที่ยังทำไม่เสร็จ
      </p>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" onClick={() => router.push("/exam/session")}>
          ทำต่อ
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => {
            clearActiveExamSession();
            clearComboSession();
            onDismiss();
          }}
        >
          เริ่มใหม่
        </Button>
      </div>
    </div>
  );
}
