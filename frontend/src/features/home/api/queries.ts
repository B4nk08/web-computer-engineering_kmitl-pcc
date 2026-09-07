import { listPublishedContents } from "@/features/content";
import { fetchCurriculum } from "@/features/curriculum";
import {
  mapActivityToHome,
  mapStaffToHome,
  mapStudentWorkToHome,
  mapVideoToHomeHero,
} from "../mappers";
import type {
  HomeActivity,
  HomeHeroMedia,
  HomeShowcaseItem,
  HomeStaffMember,
} from "../types";
import type { CurriculumProgram } from "@/features/curriculum";

/**
 * Home content queries — ชั้น API ของหน้า Home
 * เรียก content service ผ่าน feature boundary แล้ว map เป็น view-model ของ Home
 */

export async function fetchHomeStaff(): Promise<HomeStaffMember[]> {
  const rows = await listPublishedContents("staff");
  return rows.map(mapStaffToHome);
}

export async function fetchHomeShowcase(): Promise<HomeShowcaseItem[]> {
  const rows = await listPublishedContents("student_work");
  return rows.map(mapStudentWorkToHome);
}

export async function fetchHomeActivities(): Promise<HomeActivity[]> {
  const rows = await listPublishedContents("activity");
  return rows.map(mapActivityToHome);
}

export async function fetchHomeCurriculum(): Promise<CurriculumProgram | null> {
  return fetchCurriculum();
}

/** สื่อ Hero จาก content type `video` — ใช้รายการแรกตาม sort_order */
export async function fetchHomeHeroMedia(): Promise<HomeHeroMedia | null> {
  const rows = await listPublishedContents("video");
  return mapVideoToHomeHero(rows[0] ?? null);
}
