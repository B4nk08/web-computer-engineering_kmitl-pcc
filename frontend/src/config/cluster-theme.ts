import { Code2, Cpu, Database, Network, type LucideIcon } from "lucide-react";

export type ClusterTheme = {
  label: string;
  icon: LucideIcon;
  bar: string;
  text: string;
  tone: string;
  panel: string;
};

/** สีและไอคอนของกลุ่มสายงาน — ใช้ร่วมหน้าแรก หน้าอาชีพ และป๊อปอัป */
export const CLUSTER_THEME: Record<string, ClusterTheme> = {
  software: {
    label: "Software",
    icon: Code2,
    bar: "bg-[#2f5fd6]",
    text: "text-[#2f5fd6]",
    tone: "bg-[#2f5fd6]/10 text-[#2f5fd6]",
    panel: "bg-[#eef2fb]",
  },
  iot: {
    label: "IoT",
    icon: Cpu,
    bar: "bg-[#e07a3d]",
    text: "text-[#c45f28]",
    tone: "bg-[#e07a3d]/12 text-[#c45f28]",
    panel: "bg-[#faf0e8]",
  },
  network: {
    label: "Network",
    icon: Network,
    bar: "bg-[#0d9488]",
    text: "text-[#0d9488]",
    tone: "bg-[#0d9488]/10 text-[#0d9488]",
    panel: "bg-[#e8f5f3]",
  },
  data: {
    label: "Data",
    icon: Database,
    bar: "bg-[var(--navy-900)]",
    text: "text-[var(--navy-900)]",
    tone: "bg-[var(--navy-900)]/10 text-[var(--navy-900)]",
    panel: "bg-[#eef0f5]",
  },
};

const FALLBACK_THEME: ClusterTheme = {
  label: "",
  icon: Code2,
  bar: "bg-[var(--ink-soft)]",
  text: "text-[var(--ink-soft)]",
  tone: "bg-[var(--surface)] text-[var(--ink-soft)]",
  panel: "bg-[var(--surface)]",
};

export function clusterTheme(code?: string | null): ClusterTheme {
  if (code && CLUSTER_THEME[code]) return CLUSTER_THEME[code];
  return { ...FALLBACK_THEME, label: code ?? "" };
}
