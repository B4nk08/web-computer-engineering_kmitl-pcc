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
  logs: DashboardActivityLog[];
};

export async function fetchDashboard(): Promise<DashboardDto> {
  return apiClient<DashboardDto>(endpoints.dashboard);
}
