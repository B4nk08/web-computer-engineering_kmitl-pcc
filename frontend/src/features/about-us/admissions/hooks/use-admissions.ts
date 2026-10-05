"use client";

import { useAsyncData } from "@/lib/use-async-data";
import { fetchAdmissionsList } from "../api";
import type { AdmissionsInfo } from "../types";

export function useAdmissionsList() {
  return useAsyncData(fetchAdmissionsList, [] as AdmissionsInfo[], "โหลดข้อมูลรับสมัครไม่สำเร็จ");
}

export function useAdmissions() {
  const { data, loading, error } = useAdmissionsList();
  return { data: data[0] ?? null, loading, error };
}
