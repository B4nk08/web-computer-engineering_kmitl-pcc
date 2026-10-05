"use client";

import { useAsyncData } from "@/lib/use-async-data";
import { fetchCurricula } from "../api";
import type { CurriculumProgram } from "../types";

export function useCurricula() {
  return useAsyncData(fetchCurricula, [] as CurriculumProgram[], "โหลดข้อมูลหลักสูตรไม่สำเร็จ");
}

/** ใช้รายการแรกจาก listing */
export function useCurriculum() {
  const { data, loading, error } = useCurricula();
  return { data: data[0] ?? null, loading, error };
}
