"use client";

import type { CurriculumProgram } from "@/features/about-us";
import { useAsyncData } from "@/lib/use-async-data";
import {
  fetchHomeActivities,
  fetchHomeCurriculum,
  fetchHomeHeroMedia,
  fetchHomeShowcase,
  fetchHomeStaff,
} from "../api";
import type { HomeActivity, HomeHeroMedia, HomeShowcaseItem, HomeStaffMember } from "../types";

export function useHomeStaff() {
  return useAsyncData(fetchHomeStaff, [] as HomeStaffMember[], "โหลดข้อมูลไม่สำเร็จ");
}

export function useHomeShowcase() {
  return useAsyncData(fetchHomeShowcase, [] as HomeShowcaseItem[], "โหลดข้อมูลไม่สำเร็จ");
}

export function useHomeActivities() {
  return useAsyncData(fetchHomeActivities, [] as HomeActivity[], "โหลดกิจกรรมไม่สำเร็จ");
}

export function useHomeCurriculum() {
  return useAsyncData(
    fetchHomeCurriculum,
    null as CurriculumProgram | null,
    "โหลดข้อมูลหลักสูตรไม่สำเร็จ",
  );
}

export function useHomeHeroMedia() {
  return useAsyncData(fetchHomeHeroMedia, null as HomeHeroMedia | null, "โหลดวิดีโอแนะนำไม่สำเร็จ");
}
