export type VisitorAudience = "internal" | "external";

export type ActivityAction = "create" | "update" | "delete";

export type ActivityLogItem = {
  id: string;
  action: ActivityAction;
  actorName: string;
  targetTitle: string;
  targetType: string;
  audience: VisitorAudience | "admin";
  createdAt: string;
};

export type DashboardStats = {
  externalVisitors: number;
  internalVisitors: number;
  externalChange: string;
  internalChange: string;
  totalContents: number;
  recentActions: number;
};

export type VisitorTrendPoint = {
  date: string;
  external: number;
  internal: number;
};

/** Stub — จะต่อ API จริงทีหลัง */
export const mockDashboardStats: DashboardStats = {
  externalVisitors: 1284,
  internalVisitors: 356,
  externalChange: "+12.4% จากสัปดาห์ก่อน",
  internalChange: "+3.1% จากสัปดาห์ก่อน",
  totalContents: 42,
  recentActions: 18,
};

/** แนวโน้มผู้เข้าชม 7 วันล่าสุด (mock) */
export const mockVisitorTrend: VisitorTrendPoint[] = [
  { date: "20 ก.ค.", external: 142, internal: 38 },
  { date: "21 ก.ค.", external: 168, internal: 41 },
  { date: "22 ก.ค.", external: 155, internal: 52 },
  { date: "23 ก.ค.", external: 201, internal: 47 },
  { date: "24 ก.ค.", external: 188, internal: 55 },
  { date: "25 ก.ค.", external: 214, internal: 61 },
  { date: "26 ก.ค.", external: 216, internal: 62 },
];

export const mockActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "create",
    actorName: "อ.สมชาย ใจดี",
    targetTitle: "หลักสูตรวิศวกรรมคอมพิวเตอร์",
    targetType: "ข้อมูลหลักสูตร",
    audience: "admin",
    createdAt: "2026-07-26T14:20:00Z",
  },
  {
    id: "2",
    action: "delete",
    actorName: "อ.สมหญิง รักเรียน",
    targetTitle: "ข่าวเปิดบ้าน CE เก่า",
    targetType: "ข่าวสารทั่วไป",
    audience: "admin",
    createdAt: "2026-07-26T11:05:00Z",
  },
  {
    id: "3",
    action: "update",
    actorName: "อ.สมชาย ใจดี",
    targetTitle: "ค่าเทอม TCAS 68",
    targetType: "รับสมัคร / ค่าเทอม",
    audience: "admin",
    createdAt: "2026-07-25T16:40:00Z",
  },
  {
    id: "4",
    action: "create",
    actorName: "อ.วิชัย คอมพิวเตอร์",
    targetTitle: "โปรเจกต์ IoT Smart Campus",
    targetType: "ผลงานนักศึกษา",
    audience: "admin",
    createdAt: "2026-07-25T09:15:00Z",
  },
  {
    id: "5",
    action: "delete",
    actorName: "อ.สมหญิง รักเรียน",
    targetTitle: "วิดีโอแนะนำรุ่นเก่า",
    targetType: "รูปหรือวิดีโอแนะนำ",
    audience: "admin",
    createdAt: "2026-07-24T18:30:00Z",
  },
  {
    id: "6",
    action: "create",
    actorName: "อ.สมชาย ใจดี",
    targetTitle: "Software Engineer",
    targetType: "เส้นทางอาชีพ",
    audience: "admin",
    createdAt: "2026-07-24T10:00:00Z",
  },
];

export function getDashboardStats(): DashboardStats {
  return mockDashboardStats;
}

export function getVisitorTrend(): VisitorTrendPoint[] {
  return mockVisitorTrend;
}

export function getActivityLogs(): ActivityLogItem[] {
  return mockActivityLogs;
}
