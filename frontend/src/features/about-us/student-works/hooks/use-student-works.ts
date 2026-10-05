"use client";

import { useAsyncData } from "@/lib/use-async-data";
import { fetchStudentWorks } from "../api";
import type { StudentWork } from "../types";

export function useStudentWorks() {
  return useAsyncData(fetchStudentWorks, [] as StudentWork[], "โหลดผลงานไม่สำเร็จ");
}
