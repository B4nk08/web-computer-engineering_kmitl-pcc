"use client";

import {
  Activity,
  ExternalLink,
  FilePlus2,
  FilePenLine,
  FileX2,
  Globe2,
  UsersRound,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EXTERNAL_COLOR,
  INTERNAL_COLOR,
  VisitorShareChart,
  VisitorTrendChart,
} from "./visitor-charts";
import {
  getActivityLogs,
  getDashboardStats,
  getVisitorTrend,
  type ActivityAction,
  type ActivityLogItem,
} from "./mock-data";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function actionMeta(action: ActivityAction) {
  switch (action) {
    case "create":
      return {
        label: "เพิ่มข้อมูล",
        className: "bg-emerald-50 text-emerald-700",
        Icon: FilePlus2,
      };
    case "delete":
      return {
        label: "ลบข้อมูล",
        className: "bg-red-50 text-red-700",
        Icon: FileX2,
      };
    case "update":
      return {
        label: "แก้ไขข้อมูล",
        className: "bg-amber-50 text-amber-700",
        Icon: FilePenLine,
      };
  }
}

function ActivityRow({ item }: { item: ActivityLogItem }) {
  const meta = actionMeta(item.action);
  const Icon = meta.Icon;

  return (
    <li className="flex items-start gap-3 border-b border-border/60 py-3 last:border-b-0">
      <div className={`mt-0.5 rounded-md p-2 ${meta.className}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {item.actorName}{" "}
          <span className="font-normal text-muted-foreground">{meta.label}</span>
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {item.targetType}: {item.targetTitle}
        </p>
      </div>
      <time className="shrink-0 text-xs text-muted-foreground">{formatWhen(item.createdAt)}</time>
    </li>
  );
}

export function AdminDashboard() {
  const stats = getDashboardStats();
  const logs = getActivityLogs();
  const trend = getVisitorTrend();
  const share = [
    { name: "External", value: stats.externalVisitors, color: EXTERNAL_COLOR },
    { name: "Internal", value: stats.internalVisitors, color: INTERNAL_COLOR },
  ];
  const total = stats.externalVisitors + stats.internalVisitors;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          สรุปจำนวนผู้เข้าชมและบันทึกการเพิ่ม/ลบข้อมูล (ข้อมูลตัวอย่าง)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External visitors</CardTitle>
            <Globe2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.externalVisitors.toLocaleString("th-TH")}
            </div>
            <p className="text-xs text-muted-foreground">{stats.externalChange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internal visitors</CardTitle>
            <UsersRound className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.internalVisitors.toLocaleString("th-TH")}
            </div>
            <p className="text-xs text-muted-foreground">{stats.internalChange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รวมผู้เข้าชม</CardTitle>
            <ExternalLink className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString("th-TH")}</div>
            <p className="text-xs text-muted-foreground">External + Internal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การแก้ไขล่าสุด</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActions}</div>
            <p className="text-xs text-muted-foreground">
              จากเนื้อหาทั้งหมด {stats.totalContents} รายการ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>แนวโน้มผู้เข้าชม</CardTitle>
            <CardDescription>External vs Internal — 7 วันล่าสุด</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <VisitorTrendChart data={trend} />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue-600" />
                External
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-slate-500" />
                Internal
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>สัดส่วนผู้เข้าชม</CardTitle>
            <CardDescription>แยก External / Internal</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <VisitorShareChart
              external={stats.externalVisitors}
              internal={stats.internalVisitors}
            />
            <ul className="mt-2 space-y-2 text-sm">
              {share.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {item.value.toLocaleString("th-TH")} (
                    {Math.round((item.value / total) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity log</CardTitle>
          <CardDescription>บันทึกการเพิ่ม แก้ไข หรือลบข้อมูล</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {logs.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
