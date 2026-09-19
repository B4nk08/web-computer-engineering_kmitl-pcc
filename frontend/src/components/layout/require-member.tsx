"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Lock } from "lucide-react";
import { useAuth } from "@/features/auth";
import { hasAnyRole, isCEMember } from "@/config/staff-role";

const DEFAULT_MEMBER_ROLES = ["student", "teacher", "admin"] as const;

/**
 * กันหน้าตาม role จาก ce_whitelist — ไม่ข้ามการตรวจ
 */
export function RequireMember({
  children,
  roles = DEFAULT_MEMBER_ROLES,
  description = "หน้านี้สำหรับนักศึกษาและบุคลากรสาขาที่เข้าสู่ระบบแล้วเท่านั้น",
}: {
  children: React.ReactNode;
  roles?: readonly string[];
  description?: string;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
  const allowed = hasAnyRole(user?.role, roles);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[var(--surface)] px-4 py-16">
        <p className="text-sm text-[var(--ink-soft)]">กำลังตรวจสอบสิทธิ์...</p>
      </section>
    );
  }

  if (isAuthenticated && allowed) {
    return <>{children}</>;
  }

  const title = isAuthenticated ? "ไม่มีสิทธิ์เข้าหน้านี้" : "ต้องเข้าสู่ระบบก่อน";
  const body = isAuthenticated
    ? isCEMember(user?.role)
      ? "บัญชีนี้ไม่มีสิทธิ์เปิดหน้านี้"
      : "อีเมลนี้ไม่อยู่ในรายชื่อสาขาวิศวกรรมคอมพิวเตอร์"
    : description;

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[var(--surface)] px-4 py-16">
      <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--navy-900)]">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{body}</p>
        {isAuthenticated ? (
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            กลับหน้าแรก
          </Link>
        ) : (
          <Link
            href={loginHref}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy-900)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            เข้าสู่ระบบ
            <LogIn className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
