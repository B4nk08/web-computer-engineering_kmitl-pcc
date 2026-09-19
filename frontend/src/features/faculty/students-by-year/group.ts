import { cohortLabelFromStudentCode, studentCodePrefix } from "@/lib/ce-cohort";
import type { Classmate } from "./types";

export type StudentYearGroup = {
  prefix: string;
  cohort: string | null;
  students: Classmate[];
};

type Bucket = StudentYearGroup;

/** แยกรายชื่อตามรหัส (66…) หรือตามรุ่น CE ถ้าไม่มีรหัส */
export function groupStudentsByYear(items: Classmate[]): StudentYearGroup[] {
  const buckets = new Map<string, Bucket>();
  const other: Classmate[] = [];

  for (const item of items) {
    const prefixNum = studentCodePrefix(item.studentCode);
    if (prefixNum !== null) {
      const prefix = String(prefixNum).padStart(2, "0");
      const key = `p:${prefix}`;
      const bucket = buckets.get(key) ?? {
        prefix,
        cohort: null,
        students: [],
      };
      bucket.students.push(item);
      if (!bucket.cohort) {
        bucket.cohort = item.cohort ?? cohortLabelFromStudentCode(item.studentCode);
      }
      buckets.set(key, bucket);
      continue;
    }

    if (item.cohort) {
      const key = `c:${item.cohort}`;
      const bucket = buckets.get(key) ?? {
        prefix: "",
        cohort: item.cohort,
        students: [],
      };
      bucket.students.push(item);
      buckets.set(key, bucket);
      continue;
    }

    other.push(item);
  }

  const groups = [...buckets.values()].sort((a, b) => {
    if (a.prefix && b.prefix) return Number(b.prefix) - Number(a.prefix);
    return (b.cohort ?? "").localeCompare(a.cohort ?? "");
  });

  if (other.length > 0) {
    groups.push({ prefix: "", cohort: null, students: other });
  }

  return groups;
}
