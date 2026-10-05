"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  AlertCircle,
  FileQuestion,
  GraduationCap,
  Loader2,
  ScrollText,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  EXAM_COLOR,
  EXTERNAL_QUIZ_COLOR,
  INTERNAL_QUIZ_COLOR,
  UsageTrendChart,
} from "./usage-charts";
import {
  DASHBOARD_RANGES,
  fetchDashboard,
  type DashboardDto,
  type DashboardRange,
} from "./api";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  tint,
}: {
  title: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  tint: string;
}) {
  return (
    <article className="admin-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={`rounded-xl p-2 ${tint}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </article>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardDto | null>(null);
  const [range, setRange] = useState<DashboardRange>("7d");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstName = (user?.displayName || user?.email || "Staff").split(/\s+/)[0];
  const rangeMeta = DASHBOARD_RANGES.find((item) => item.id === range) ?? DASHBOARD_RANGES[1];
  const loaded = useRef(false);

  useEffect(() => {
    let mounted = true;
    if (loaded.current) setChartLoading(true);
    else setLoading(true);
    setError(null);
    fetchDashboard(range)
      .then((payload) => {
        if (!mounted) return;
        loaded.current = true;
        setData(payload);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "โหลดแดชบอร์ดไม่สำเร็จ");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
        setChartLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [range]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">แดชบอร์ด</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {firstName} · สรุป Quiz และ Exit Exam
          </p>
        </div>
        <Link href="/admin/activity" className="text-sm font-medium text-[#1f4b82] hover:underline">
          ดูบันทึกการแก้ไข
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          กำลังโหลดแดชบอร์ด...
        </div>
      ) : error ? (
        <div className="admin-card flex items-start gap-3 border-rose-200/80 bg-rose-50 p-5 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Quiz ภายนอก"
              value={data.external_quiz_plays.toLocaleString("th-TH")}
              hint="ครั้งที่ผู้สนใจเล่นแบบทดสอบ"
              icon={FileQuestion}
              tint="bg-sky-50 text-sky-800"
            />
            <StatCard
              title="Quiz ภายในสาขา"
              value={data.internal_quiz_plays.toLocaleString("th-TH")}
              hint="ครั้งที่นักศึกษาเล่นแบบทดสอบ"
              icon={GraduationCap}
              tint="bg-violet-50 text-violet-800"
            />
            <StatCard
              title="Exit Exam ที่เริ่มทำ"
              value={data.exam_started.toLocaleString("th-TH")}
              hint="รวมทุกกลุ่มวิชา"
              icon={ScrollText}
              tint="bg-emerald-50 text-emerald-800"
            />
            <StatCard
              title="Exit Exam ที่ส่งแล้ว"
              value={data.exam_submitted.toLocaleString("th-TH")}
              hint="ส่งคำตอบครบ"
              icon={ScrollText}
              tint="bg-amber-50 text-amber-800"
            />
          </div>

          <article className="admin-card min-w-0 p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight">การใช้งาน</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Quiz ภายนอก / ภายในสาขา และ Exit Exam · ตัวเลขการ์ดด้านบนเป็นยอดสะสมทั้งหมด
                </p>
              </div>
              <div className="flex flex-wrap gap-1 rounded-full bg-muted/70 p-1">
                {DASHBOARD_RANGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRange(item.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm transition",
                      range === item.id
                        ? "bg-white font-medium text-[#1f4b82] shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={cn("transition-opacity", chartLoading && "opacity-50")}>
              {data.trend.every(
                (point) =>
                  point.external_quiz === 0 && point.internal_quiz === 0 && point.exam === 0,
              ) ? (
                <p className="rounded-2xl border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
                  {rangeMeta.empty}
                </p>
              ) : (
                <>
                  <UsageTrendChart data={data.trend} range={range} />
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: EXTERNAL_QUIZ_COLOR }}
                      />
                      Quiz ภายนอก
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: INTERNAL_QUIZ_COLOR }}
                      />
                      Quiz ภายในสาขา
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: EXAM_COLOR }}
                      />
                      Exit Exam
                    </span>
                  </div>
                </>
              )}
            </div>
          </article>
        </>
      ) : null}
    </div>
  );
}
