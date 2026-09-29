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
import type { DashboardTrendPoint } from "./api";

export const EXTERNAL_QUIZ_COLOR = "#1f4b82";
export const INTERNAL_QUIZ_COLOR = "#6b7c93";
export const EXAM_COLOR = "#2f8f6b";

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

export function UsageTrendChart({ data }: { data: DashboardTrendPoint[] }) {
  return (
    <ChartFrame height={280}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillExternalQuiz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EXTERNAL_QUIZ_COLOR} stopOpacity={0.35} />
              <stop offset="95%" stopColor={EXTERNAL_QUIZ_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillInternalQuiz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={INTERNAL_QUIZ_COLOR} stopOpacity={0.3} />
              <stop offset="95%" stopColor={INTERNAL_QUIZ_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillExam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EXAM_COLOR} stopOpacity={0.28} />
              <stop offset="95%" stopColor={EXAM_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e2d6" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#7a736c" }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#7a736c" }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e4ddd0",
              background: "#fffefb",
              color: "#2c241c",
              fontSize: 12,
              boxShadow: "0 10px 24px rgba(44,36,28,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="external_quiz"
            name="Quiz ภายนอก"
            stroke={EXTERNAL_QUIZ_COLOR}
            fill="url(#fillExternalQuiz)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="internal_quiz"
            name="Quiz ภายในสาขา"
            stroke={INTERNAL_QUIZ_COLOR}
            fill="url(#fillInternalQuiz)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="exam"
            name="Exit Exam"
            stroke={EXAM_COLOR}
            fill="url(#fillExam)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
