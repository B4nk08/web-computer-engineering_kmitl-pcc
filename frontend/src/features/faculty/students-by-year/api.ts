import { apiClient, endpoints } from "@/lib/api";
import type { Classmate, ClassmateDto } from "./types";

function mapClassmate(row: ClassmateDto): Classmate {
  return {
    id: row.id,
    studentCode: row.student_code?.trim() || null,
    fullName: row.full_name,
    cohort: row.cohort ?? null,
    isSelf: Boolean(row.is_self),
  };
}

/** GET /api/students — นักศึกษาเห็นเฉพาะรุ่นของตนเอง */
export async function fetchClassmates(): Promise<Classmate[]> {
  const rows = await apiClient<ClassmateDto[]>(endpoints.students.list);
  return (rows ?? []).map(mapClassmate);
}
