"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import {
  canAccessNavItem,
  findAdminNavItem,
  type StaffRole,
} from "@/config/admin-nav";
import { isStaffRole } from "@/config/staff-role";

/**
 * กันเข้า /admin ถ้ายังไม่ login หรือ role ไม่ใช่ admin/teacher
 * และกัน path ที่ role นั้นเข้าไม่ได้ (เช่น Exit Exam = teacher เท่านั้น)
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isStaffRole(user.role)) {
      router.replace("/");
      return;
    }

    const item = findAdminNavItem(pathname);
    if (item && !canAccessNavItem(item, user.role as StaffRole)) {
      router.replace("/admin");
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading || !user || !isStaffRole(user.role)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-sm text-neutral-500">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  const item = findAdminNavItem(pathname);
  if (item && !canAccessNavItem(item, user.role as StaffRole)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-sm text-neutral-500">
        ไม่มีสิทธิ์เข้าหน้านี้...
      </div>
    );
  }

  return <>{children}</>;
}
