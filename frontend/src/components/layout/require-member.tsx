"use client";

import { LogIn, Lock } from "lucide-react";
import { useRole } from "@/hooks/use-role";

/**
 * require-member.tsx
 * -------------------
 * ห่อหน้าที่ต้อง "ล็อกอินเป็นนักศึกษา/อาจารย์/แอดมิน" เท่านั้นถึงจะเข้าได้
 * (เช่นหน้า Quizz แนะนำสาย) ถ้า role ยังเป็น guest จะเห็นหน้าแจ้งให้ล็อกอินก่อน
 * แทนเนื้อหาจริง
 *
 * หมายเหตุ: ตอนนี้ยังไม่มีระบบล็อกอินจริง (ดู hooks/use-role.tsx) ปุ่ม
 * "เข้าสู่ระบบ" ด้านล่างจึงแค่จำลองการสลับ role เพื่อสาธิต เมื่อเชื่อมระบบ
 * ล็อกอินจริงแล้ว ให้แทนที่ปุ่มนี้ด้วยลิงก์ไปหน้า Login จริงแทน
 */
export function RequireMember({ children }: { children: React.ReactNode }) {
  const { role, login } = useRole();

  if (role === "member") return <>{children}</>;

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[var(--surface)] px-4 py-16">
      <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy-900)]">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">ต้องเข้าสู่ระบบก่อน</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          หน้านี้สำหรับนักศึกษาที่เข้าสู่ระบบแล้วเท่านั้น กรุณาเข้าสู่ระบบด้วยบัญชีนักศึกษาเพื่อทำแบบทดสอบ
        </p>
        <button
          type="button"
          onClick={login}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
        >
          เข้าสู่ระบบ (สาธิต)
          <LogIn className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
