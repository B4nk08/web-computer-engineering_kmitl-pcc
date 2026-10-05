"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { DashboardRange, DashboardTrendPoint } from "./api";

export const EXTERNAL_QUIZ_COLOR = "#1f4b82";
export const INTERNAL_QUIZ_COLOR = "#7c6bb5";
export const EXAM_COLOR = "#2f8f6b";

const SERIES = [
  { key: "external_quiz", name: "Quiz ภายนอก", color: EXTERNAL_QUIZ_COLOR },
  { key: "internal_quiz", name: "Quiz ภายในสาขา", color: INTERNAL_QUIZ_COLOR },
  { key: "exam", name: "Exit Exam", color: EXAM_COLOR },
] as const;

function ChartFrame({
  height,
  children,
}: {
  height: number;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="w-full min-w-0" style={{ height }}>
      {ready ? (
        children
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          กำลังโหลดกราฟ...
        </div>
      )}
    </div>
  );
}

function TrendTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-[#e4ddd0] bg-white px-3.5 py-2.5 text-xs shadow-[0_12px_28px_rgba(31,75,130,0.12)]">
      <p className="mb-1.5 font-medium text-[#1c2430]">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <p key={String(item.dataKey)} className="flex items-center justify-between gap-6">
            <span className="inline-flex items-center gap-1.5 text-[#5c6778]">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="tabular-nums font-medium text-[#1c2430]">{item.value} ครั้ง</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function tickInterval(range: DashboardRange, length: number) {
  if (range === "1d") return length > 12 ? 2 : 0;
  if (range === "30d") return 4;
  if (range === "90d") return 13;
  return 0;
}

export function UsageTrendChart({
  data,
  range,
}: {
  data: DashboardTrendPoint[];
  range: DashboardRange;
}) {
  const showDots = range !== "90d";

  return (
    <ChartFrame height={320}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
        <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {SERIES.map((series) => (
              <linearGradient key={series.key} id={`fill-${series.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={series.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#e7eef6" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            interval={tickInterval(range, data.length)}
            tick={{ fontSize: 12, fill: "#7a8696" }}
            dy={6}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#7a8696" }}
            width={32}
          />
          <Tooltip content={TrendTooltip} cursor={{ stroke: "#c5d4e8", strokeWidth: 1 }} />
          {SERIES.map((series) => (
            <Area
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.name}
              stroke={series.color}
              fill={`url(#fill-${series.key})`}
              strokeWidth={2.25}
              dot={showDots ? { r: 3, strokeWidth: 0, fill: series.color } : false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: series.color }}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
