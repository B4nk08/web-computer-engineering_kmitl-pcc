"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VisitorTrendPoint } from "./mock-data";

const EXTERNAL_COLOR = "#2563eb";
const INTERNAL_COLOR = "#64748b";

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

export function VisitorTrendChart({ data }: { data: VisitorTrendPoint[] }) {
  return (
    <ChartFrame height={280}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillExternal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EXTERNAL_COLOR} stopOpacity={0.35} />
              <stop offset="95%" stopColor={EXTERNAL_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillInternal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={INTERNAL_COLOR} stopOpacity={0.3} />
              <stop offset="95%" stopColor={INTERNAL_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#737373" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#737373" }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e5e5",
                      background: "#ffffff",
                      color: "#171717",
                      fontSize: 12,
                    }}
                  />
          <Area
            type="monotone"
            dataKey="external"
            name="External"
            stroke={EXTERNAL_COLOR}
            fill="url(#fillExternal)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="internal"
            name="Internal"
            stroke={INTERNAL_COLOR}
            fill="url(#fillInternal)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function VisitorShareChart({
  external,
  internal,
}: {
  external: number;
  internal: number;
}) {
  const share = [
    { name: "External", value: external, color: EXTERNAL_COLOR },
    { name: "Internal", value: internal, color: INTERNAL_COLOR },
  ];

  return (
    <ChartFrame height={220}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
        <PieChart>
          <Pie
            data={share}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={84}
            paddingAngle={3}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {share.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString("th-TH")}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e5e5",
              background: "#ffffff",
              color: "#171717",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export { EXTERNAL_COLOR, INTERNAL_COLOR };
