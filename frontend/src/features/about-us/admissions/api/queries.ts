import { listPublishedContents } from "@/features/content";
import { mapAdmissions } from "../mappers";
import type { AdmissionsInfo } from "../types";

/** ดึงข้อมูลรับสมัครที่เผยแพร่แล้ว (รายการแรก) */
export async function fetchAdmissions(): Promise<AdmissionsInfo | null> {
  const rows = await listPublishedContents("admissions");
  if (rows.length === 0) return null;
  return mapAdmissions(rows[0]);
}
