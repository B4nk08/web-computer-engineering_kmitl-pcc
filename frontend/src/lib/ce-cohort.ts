/**
 * รุ่น CE จากรหัสนักศึกษา
 * รหัสขึ้นต้นด้วยปี พ.ศ. 2 หลัก เช่น 64200002 → 64
 *
 * กฎ: 64 = CE01 (รุ่นแรก) แล้ว +1 ต่อปี
 * 65 = CE02, 66 = CE03, 67 = CE04, ...
 */

export const CE_FIRST_COHORT_PREFIX = 64;
export const CE_FIRST_COHORT_NUMBER = 1;

/** ดึง 2 หลักแรกของรหัสนักศึกษา (เช่น "64200002" → 64) */
export function studentCodePrefix(studentCode: string | null | undefined): number | null {
  if (!studentCode) return null;
  const digits = String(studentCode).trim().match(/^(\d{2})/);
  if (!digits) return null;
  const n = Number.parseInt(digits[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** หมายเลขรุ่น (1, 2, 3, …) จากรหัส — 64 → 1 */
export function cohortNumberFromStudentCode(
  studentCode: string | null | undefined
): number | null {
  const prefix = studentCodePrefix(studentCode);
  if (prefix === null) return null;
  const num = prefix - CE_FIRST_COHORT_PREFIX + CE_FIRST_COHORT_NUMBER;
  return num >= 1 ? num : null;
}

/** ชื่อรุ่น เช่น CE01, CE02 จากรหัสนักศึกษา */
export function cohortLabelFromStudentCode(
  studentCode: string | null | undefined
): string | null {
  const num = cohortNumberFromStudentCode(studentCode);
  if (num === null) return null;
  return `CE${String(num).padStart(2, "0")}`;
}

/** จากหมายเลขรุ่น → prefix รหัส (CE01 → 64) */
export function studentPrefixFromCohortNumber(cohortNumber: number): number | null {
  if (!Number.isInteger(cohortNumber) || cohortNumber < 1) return null;
  return CE_FIRST_COHORT_PREFIX + cohortNumber - CE_FIRST_COHORT_NUMBER;
}
