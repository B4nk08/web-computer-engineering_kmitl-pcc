import type { StaffRole } from "@/config/admin-nav";

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return role === "admin" || role === "teacher";
}

export function isStudentRole(role: string | null | undefined): boolean {
  return role === "student";
}

/** อยู่ใน ce_whitelist — นักศึกษา / อาจารย์ / แอดมิน */
export function isCEMember(role: string | null | undefined): boolean {
  return isStudentRole(role) || isStaffRole(role);
}

export function hasAnyRole(
  role: string | null | undefined,
  allowed: readonly string[]
): boolean {
  return Boolean(role && allowed.includes(role));
}

/** ป้ายเข้าแผงจัดการ — ให้ตรงกับ role จริง ไม่ใช้คำว่า Admin กับ teacher */
export function staffPanelLabel(role: string | null | undefined): string {
  if (role === "teacher") return "Teacher";
  if (role === "admin") return "Admin";
  return "Staff";
}
