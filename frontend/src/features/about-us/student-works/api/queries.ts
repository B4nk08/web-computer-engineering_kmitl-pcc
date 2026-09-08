import { listPublishedContents } from "@/features/content";
import { mapStudentWork } from "../mappers";
import type { StudentWork } from "../types";

export async function fetchStudentWorks(): Promise<StudentWork[]> {
  const rows = await listPublishedContents("student_work");
  return rows.map(mapStudentWork);
}
