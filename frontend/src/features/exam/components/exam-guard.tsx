"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth";
import { isCEMember } from "@/config/staff-role";

/** Exit Exam บนหน้าหลัก — นักศึกษาทำข้อสอบ / อาจารย์และแอดมินเข้าดูได้ */
export function ExamGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isCEMember(user.role)) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        <Loader2 className="mr-2 size-4 animate-spin" />
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!isCEMember(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        ไม่มีสิทธิ์เข้าหน้านี้...
      </div>
    );
  }

  return <>{children}</>;
}
