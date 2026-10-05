"use client";

import { useAsyncData } from "@/lib/use-async-data";
import { fetchActivities } from "../api";
import type { ActivityItem } from "../types";

export function useActivities() {
  return useAsyncData(fetchActivities, [] as ActivityItem[], "โหลดกิจกรรมไม่สำเร็จ");
}
