import { listPublishedContents } from "@/features/content";
import { fetchCurriculum, type CurriculumProgram } from "@/features/about-us/curriculum";
import { fetchActivities } from "@/features/about-us/activities/api";
import { fetchStudentWorks } from "@/features/about-us/student-works/api";
import { mapStaffToHome, mapVideoToHomeHero } from "../mappers";
import type {
  HomeActivity,
  HomeHeroMedia,
  HomeShowcaseItem,
  HomeStaffMember,
} from "../types";

/**
 * Home content queries — ชั้น API ของหน้า Home
 * เรียก content service ผ่าน feature boundary แล้ว map เป็น view-model ของ Home
 */

export async function fetchHomeStaff(): Promise<HomeStaffMember[]> {
  const rows = await listPublishedContents("staff");
  return rows.map(mapStaffToHome);
}

export async function fetchHomeShowcase(): Promise<HomeShowcaseItem[]> {
  return fetchStudentWorks();
}

export async function fetchHomeActivities(): Promise<HomeActivity[]> {
  return fetchActivities();
}

export async function fetchHomeCurriculum(): Promise<CurriculumProgram | null> {
  return fetchCurriculum();
}

/** สื่อ Hero จาก content type `video` — ใช้รายการแรกตาม sort_order */
export async function fetchHomeHeroMedia(): Promise<HomeHeroMedia | null> {
  const rows = await listPublishedContents("video");
  return mapVideoToHomeHero(rows[0] ?? null);
}
