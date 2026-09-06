"use client";

import Link from "next/link";
import { LogIn, Lock } from "lucide-react";
import { useAuth, isAuthBypassEnabled } from "@/features/auth";

/**
 * ห่อหน้าที่ต้อง login ก่อน (เช่น Quizz แนะนำสาย)
 * ถ้าเปิด AUTH_BYPASS หรือ login แล้ว → แสดงเนื้อหาได้เลย
 */
export function RequireMember({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const bypass = isAuthBypassEnabled();

  if (bypass || (!loading && isAuthenticated)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[var(--surface)] px-4 py-16">
        <p className="text-sm text-[var(--ink-soft)]">กำลังตรวจสอบสิทธิ์...</p>
      </section>
    );
  }

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
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
        >
          เข้าสู่ระบบ
          <LogIn className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
