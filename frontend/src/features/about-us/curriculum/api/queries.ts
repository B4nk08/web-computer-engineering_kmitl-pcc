import { listPublishedContents } from "@/features/content";
import { mapCurriculum } from "../mappers";
import type { CurriculumProgram } from "../types";

/** หลักสูตรที่เผยแพร่ทั้งหมด ตามลำดับ Admin */
export async function fetchCurricula(): Promise<CurriculumProgram[]> {
  const rows = await listPublishedContents("curriculum");
  return rows.map(mapCurriculum);
}

/** หลักสูตรหลักสำหรับหน้าแรก — รายการที่มีรูป About Us หรือรายการแรก */
export async function fetchCurriculum(): Promise<CurriculumProgram | null> {
  const rows = await fetchCurricula();
  return rows.find((row) => row.aboutImageUrl) ?? rows[0] ?? null;
}
