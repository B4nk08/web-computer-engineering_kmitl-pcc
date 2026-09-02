"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth";

/** กันหน้า exam ทั้งหมดไว้เฉพาะผู้ที่ login แล้ว (นักศึกษา/อาจารย์/แอดมิน) */
export function ExamGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
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

  return <>{children}</>;
}
