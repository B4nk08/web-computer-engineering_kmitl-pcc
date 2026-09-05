import { listPublishedContents } from "@/features/content";
import { mapCurriculum } from "../mappers";
import type { CurriculumProgram } from "../types";

/** ดึงหลักสูตรที่เผยแพร่แล้ว (รายการแรก) */
export async function fetchCurriculum(): Promise<CurriculumProgram | null> {
  const rows = await listPublishedContents("curriculum");
  if (rows.length === 0) return null;
  return mapCurriculum(rows[0]);
}
