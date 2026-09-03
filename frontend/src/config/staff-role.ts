import type { StaffRole } from "@/config/admin-nav";

/**
 * Stub role สำหรับ admin shell จนกว่าจะต่อ auth จริง
 * - admin: เห็น Quiz แต่ไม่เห็น Exit Exam
 * - teacher: เห็นทั้งหมด
 */
export const CURRENT_STAFF_ROLE: StaffRole =
  (process.env.NEXT_PUBLIC_STAFF_ROLE as StaffRole | undefined) ?? "admin";
