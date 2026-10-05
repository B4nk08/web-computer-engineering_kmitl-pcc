import { apiClient, endpoints } from "@/lib/api";

export type DashboardTrendPoint = {
  date: string;
  external_quiz: number;
  internal_quiz: number;
  exam: number;
};

export type DashboardActivityLog = {
  id: string;
  action: "create" | "delete" | string;
  actor_name: string;
  target_type: string;
  target_title: string;
  created_at: string;
};

export type DashboardDto = {
  external_quiz_plays: number;
  internal_quiz_plays: number;
  exam_started: number;
  exam_submitted: number;
  trend: DashboardTrendPoint[];
};

export type DashboardRange = "1d" | "7d" | "30d" | "90d";

export const DASHBOARD_RANGES: { id: DashboardRange; label: string; empty: string }[] = [
  { id: "1d", label: "วันนี้", empty: "วันนี้ยังไม่มีการเล่น Quiz หรือ Exit Exam" },
  { id: "7d", label: "7 วัน", empty: "ยังไม่มีการเล่น Quiz หรือ Exit Exam ใน 7 วันที่ผ่านมา" },
  { id: "30d", label: "30 วัน", empty: "ยังไม่มีการเล่น Quiz หรือ Exit Exam ใน 30 วันที่ผ่านมา" },
  { id: "90d", label: "90 วัน", empty: "ยังไม่มีการเล่น Quiz หรือ Exit Exam ใน 90 วันที่ผ่านมา" },
];

export async function fetchDashboard(range: DashboardRange = "7d"): Promise<DashboardDto> {
  return apiClient<DashboardDto>(endpoints.dashboard, { query: { range } });
}

export async function fetchActivityLogs(): Promise<DashboardActivityLog[]> {
  return apiClient<DashboardActivityLog[]>(endpoints.dashboardLogs);
}
