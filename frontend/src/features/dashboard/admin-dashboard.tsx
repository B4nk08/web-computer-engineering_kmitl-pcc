"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  AlertCircle,
  FilePlus2,
  FileQuestion,
  FileX2,
  GraduationCap,
  Loader2,
  ScrollText,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { ApiError } from "@/lib/api";
import {
  EXAM_COLOR,
  EXTERNAL_QUIZ_COLOR,
  INTERNAL_QUIZ_COLOR,
  UsageTrendChart,
} from "./usage-charts";
import {
  fetchDashboard,
  type DashboardActivityLog,
  type DashboardDto,
} from "./api";

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

function todayLabel() {
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

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
    <li className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <div className={`mt-0.5 rounded-xl p-2 ${meta.className}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {actor}{" "}
          <span className="font-normal text-muted-foreground">{meta.label}</span>
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {item.target_type}: {item.target_title}
        </p>
      </div>
      <time className="shrink-0 text-xs text-muted-foreground">
        {formatWhen(item.created_at)}
      </time>
    </li>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firstName = (user?.displayName || user?.email || "Staff").split(/\s+/)[0];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchDashboard()
      .then((payload) => {
        if (mounted) setData(payload);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "โหลดแดชบอร์ดไม่สำเร็จ"
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">แดชบอร์ด</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {firstName} · สรุป Quiz, Exit Exam และการแก้ไขข้อมูลเว็บ
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{todayLabel()}</p>
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

          <div className="grid gap-4">
            <article className="admin-card min-w-0 p-5 lg:p-6">
              <div className="mb-4">
                <h3 className="text-base font-semibold tracking-tight">การใช้งาน 7 วันล่าสุด</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Quiz ภายนอก / ภายในสาขา และ Exit Exam
                </p>
              </div>
              {data.trend.every(
                (point) =>
                  point.external_quiz === 0 &&
                  point.internal_quiz === 0 &&
                  point.exam === 0
              ) ? (
                <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
                  ยังไม่มีการเล่น Quiz หรือ Exit Exam ใน 7 วันที่ผ่านมา
                </p>
              ) : (
                <>
                  <UsageTrendChart data={data.trend} />
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
            </article>

            <article className="admin-card p-5 sm:p-6">
              <div className="mb-4">
                <h3 className="text-base font-semibold tracking-tight">บันทึกการแก้ไขเว็บ</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  รายการที่เพิ่มหรือลบล่าสุด
                </p>
              </div>
              {data.logs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                  ยังไม่มีบันทึกการเพิ่มหรือลบข้อมูล
                </p>
              ) : (
                <ul className="divide-y divide-border/70">
                  {data.logs.map((item) => (
                    <ActivityRow key={`${item.action}-${item.id}`} item={item} />
                  ))}
                </ul>
              )}
            </article>
          </div>
        </>
      ) : null}
    </div>
  );
}
