import { listPublishedContents } from "@/features/content";
import { mapAdmissions } from "../mappers";
import type { AdmissionsInfo } from "../types";

/** รอบรับสมัครที่เผยแพร่ทั้งหมด ตามลำดับ Admin */
export async function fetchAdmissionsList(): Promise<AdmissionsInfo[]> {
  const rows = await listPublishedContents("admissions");
  return rows.map(mapAdmissions);
}

/** รายการแรก — เผื่อโค้ดเดิม */
export async function fetchAdmissions(): Promise<AdmissionsInfo | null> {
  const rows = await fetchAdmissionsList();
  return rows[0] ?? null;
}
