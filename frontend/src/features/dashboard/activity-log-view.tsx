"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FilePlus2, FileX2, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { formatThaiDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { fetchActivityLogs, type DashboardActivityLog } from "./api";

type LogFilter = "all" | "create" | "delete";

const FILTERS: { id: LogFilter; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "create", label: "เพิ่มข้อมูล" },
  { id: "delete", label: "ลบข้อมูล" },
];

function actionMeta(action: string) {
  if (action === "delete") {
    return {
      label: "ลบข้อมูล",
      className: "bg-rose-50 text-rose-800",
      Icon: FileX2,
    };
  }
  return {
    label: "เพิ่มข้อมูล",
    className: "bg-emerald-50 text-emerald-800",
    Icon: FilePlus2,
  };
}

function ActivityRow({ item }: { item: DashboardActivityLog }) {
  const meta = actionMeta(item.action);
  const Icon = meta.Icon;
  const actor = item.actor_name?.trim() || "ระบบ";

  return (
    <li className="flex items-start gap-3 px-4 py-4 sm:px-5">
      <div className={`mt-0.5 rounded-xl p-2 ${meta.className}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {actor} <span className="font-normal text-muted-foreground">{meta.label}</span>
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {item.target_type}: {item.target_title}
        </p>
      </div>
      <time className="shrink-0 text-xs text-muted-foreground">
        {formatThaiDate(item.created_at, "datetime")}
      </time>
    </li>
  );
}

export function ActivityLogView() {
  const [logs, setLogs] = useState<DashboardActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LogFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchActivityLogs()
      .then((items) => {
        if (mounted) setLogs(items);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "โหลดบันทึกไม่สำเร็จ");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const shown = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return logs.filter((item) => {
      if (filter !== "all" && item.action !== filter) return false;
      if (!keyword) return true;
      return [item.actor_name, item.target_type, item.target_title]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [logs, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">บันทึกการแก้ไขเว็บ</h2>
        <p className="mt-1 text-sm text-muted-foreground">รายการที่เพิ่มหรือลบล่าสุด</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition",
                filter === item.id
                  ? "bg-[#1f4b82] text-white"
                  : "bg-white text-muted-foreground ring-1 ring-border hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาชื่อ คนแก้ หรือประเภท"
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          กำลังโหลดบันทึก...
        </div>
      ) : error ? (
        <div className="admin-card flex items-start gap-3 border-rose-200/80 bg-rose-50 p-5 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
          {logs.length === 0 ? "ยังไม่มีบันทึกการเพิ่มหรือลบข้อมูล" : "ไม่พบบันทึกที่ค้นหา"}
        </p>
      ) : (
        <article className="admin-card overflow-hidden">
          <p className="border-b border-border/70 px-4 py-3 text-sm text-muted-foreground sm:px-5">
            {shown.length.toLocaleString("th-TH")} รายการ
          </p>
          <ul className="divide-y divide-border/70">
            {shown.map((item) => (
              <ActivityRow key={`${item.action}-${item.id}`} item={item} />
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}
