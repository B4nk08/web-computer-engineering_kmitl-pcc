import type { StaffRole } from "@/config/admin-nav";

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return role === "admin" || role === "teacher";
}

/** @deprecated ใช้ role จาก useAuth() แทน — คงไว้เผื่อ env override ตอน dev */
export const CURRENT_STAFF_ROLE: StaffRole =
  (process.env.NEXT_PUBLIC_STAFF_ROLE as StaffRole | undefined) ?? "admin";
