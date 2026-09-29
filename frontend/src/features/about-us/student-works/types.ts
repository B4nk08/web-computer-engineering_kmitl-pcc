/** ผลงานนักศึกษา / โครงงานปี 4 — การ์ด listing พร้อมลิงก์เข้าใช้งาน */

export const STUDENT_WORK_CATEGORIES = [
  "Software",
  "Hardware",
  "Hardware & Software",
  "Other",
] as const;

export type StudentWorkCategory = (typeof STUDENT_WORK_CATEGORIES)[number];

export type StudentWork = {
  id: string;
  title: string;
  /** หมวดหมู่ เช่น Software / Hardware */
  subtitle: string;
  detail: string;
  imageUrl: string;
  galleryUrls: string[];
  year: string;
  projectUrl: string;
  /** คู่มือการใช้งาน / เนื้อหาเพิ่มใน popup */
  manual: string;
  /** ไฟล์ PDF คู่มือ (ถ้ามี) */
  manualUrl: string;
};

/** รูปปก + แกลเลอรี รวมไม่ซ้ำ — ใช้กับ gallery strip */
export function studentWorkPhotos(item: StudentWork): string[] {
  const seen = new Set<string>();
  const photos: string[] = [];
  for (const url of [item.imageUrl, ...item.galleryUrls]) {
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    photos.push(trimmed);
  }
  return photos;
}

/** ทำให้ค่าหมวดจาก admin/ข้อมูลเก่าเทียบกันได้ */
export function normalizeStudentWorkCategory(raw: string): string {
  const value = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!value) return "Other";
  if (value === "software") return "Software";
  if (value === "hardware") return "Hardware";
  if (
    value === "hardware & software" ||
    value === "hardware&software" ||
    value === "hardware and software" ||
    value === "hardware/software"
  ) {
    return "Hardware & Software";
  }
  if (value === "other" || value === "อื่นๆ" || value === "อื่น") return "Other";
  // ค่าเก่าที่พิมพ์อิสระ — เก็บข้อความเดิมไว้เป็นหมวด
  return raw.trim();
}
