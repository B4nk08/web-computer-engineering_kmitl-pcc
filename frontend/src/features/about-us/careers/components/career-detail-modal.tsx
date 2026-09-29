"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { careerSalaryRows, type CareerPath } from "../types";

const CLUSTER_LABEL: Record<string, string> = {
  software: "Software",
  iot: "IoT",
  network: "Network",
  data: "Data",
};

const CLUSTER_PANEL: Record<string, string> = {
  software: "bg-[#eef2fb]",
  iot: "bg-[#faf0e8]",
  network: "bg-[#e8f5f3]",
  data: "bg-[#eef0f5]",
};

const CLUSTER_ACCENT: Record<string, string> = {
  software: "bg-[#2f5fd6]",
  iot: "bg-[#e07a3d]",
  network: "bg-[#0d9488]",
  data: "bg-[var(--navy-900)]",
};

const CLUSTER_ACCENT_TEXT: Record<string, string> = {
  software: "text-[#2f5fd6]",
  iot: "text-[#c45f28]",
  network: "text-[#0d9488]",
  data: "text-[var(--navy-900)]",
};

/** แยกทักษะด้วยจุลภาค / บรรทัด — ไม่ตัดด้วย / เพื่อคงคำอย่าง React/Vue */
function skillItems(raw: string): string[] {
  return raw
    .split(/\n+|[,;·•]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function salaryAmount(amount: string): string {
  return amount.replace(/\s*บาท\/เดือน\s*$/, "").trim();
}

export function CareerDetailModal({
  item,
  clusterLabel,
  onClose,
}: {
  item: CareerPath;
  clusterLabel?: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const groupLabel =
    clusterLabel ||
    CLUSTER_LABEL[item.clusterCode] ||
    item.clusterCode ||
    "Career";
  const panel =
    CLUSTER_PANEL[item.clusterCode] ?? "bg-[var(--surface)]";
  const accent = CLUSTER_ACCENT[item.clusterCode] ?? "bg-[var(--ink-soft)]";
  const accentText =
    CLUSTER_ACCENT_TEXT[item.clusterCode] ?? "text-[var(--ink-soft)]";

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  if (typeof document === "undefined") return null;

  const salaryRows = careerSalaryRows(item);
  const skills = item.skills ? skillItems(item.skills) : [];
  const hasRight = salaryRows.length > 0 || skills.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--navy-950)]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4 md:p-6 lg:p-10"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="relative flex max-h-[min(94svh,100%)] w-full max-w-6xl flex-col overflow-y-auto overscroll-contain rounded-t-2xl bg-white shadow-[0_28px_80px_rgba(10,18,41,0.22)] sm:max-h-[90svh] sm:rounded-2xl lg:flex-row lg:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* mobile drag hint */}
        <div
          className="flex justify-center pt-2.5 pb-1 sm:hidden"
          aria-hidden
        >
          <span className="h-1 w-10 rounded-full bg-[var(--border)]" />
        </div>

        <button
          type="button"
          aria-label="ปิด"
          onClick={() => onCloseRef.current()}
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-[var(--ink-soft)] shadow-sm transition hover:bg-white hover:text-[var(--navy-900)] sm:top-4 sm:right-4 lg:bg-transparent lg:shadow-none"
        >
          <X className="size-4" aria-hidden />
        </button>

        {/* Left — identity + about */}
        <div
          className={cn(
            "relative flex shrink-0 flex-col px-5 pt-3 pb-6 sm:px-8 sm:pt-8 sm:pb-9 lg:w-[42%] lg:shrink-0 lg:overflow-y-auto lg:px-9 lg:py-10",
            panel,
          )}
        >
          <div className={cn("mb-4 h-1 w-10 rounded-full sm:mb-5", accent)} aria-hidden />
          <p
            className={cn(
              "pr-10 text-[11px] font-medium tracking-[0.14em] uppercase",
              accentText,
            )}
          >
            {groupLabel}
            {item.role ? `  ·  ${item.role}` : ""}
          </p>
          <h2
            id={titleId}
            className="mt-2 pr-10 text-[1.45rem] font-semibold tracking-tight text-[var(--navy-900)] sm:text-[1.85rem]"
          >
            {item.title}
          </h2>

          {item.detail ? (
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[1.7] text-[var(--ink)]/90 sm:mt-5 sm:leading-[1.75]">
              {item.detail}
            </p>
          ) : null}

          {item.outlook ? (
            <div className="mt-6 border-t border-[var(--navy-900)]/10 pt-5 lg:mt-auto lg:pt-6">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                โอกาสเติบโต
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                {item.outlook}
              </p>
            </div>
          ) : !item.detail && !hasRight ? (
            <p className="mt-6 text-sm text-[var(--ink-soft)]">
              ยังไม่มีรายละเอียดเพิ่มเติม — เพิ่มได้ที่ Admin → เส้นทางอาชีพ
            </p>
          ) : null}
        </div>

        {/* Right — salary + skills */}
        <div className="min-h-0 flex-1 bg-white px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-9 lg:overflow-y-auto lg:px-9 lg:py-10">
          {salaryRows.length > 0 ? (
            <section>
              <h3 className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                ฐานเงินเดือนตามระดับ
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-soft)]">
                ค่าประมาณในตลาด — ขึ้นกับบริษัท ทักษะ และพื้นที่ทำงาน
              </p>
              <ul className="mt-4 space-y-0 sm:mt-5">
                {salaryRows.map((row) => (
                  <li
                    key={row.level}
                    className="flex items-end justify-between gap-3 border-b border-[var(--border)] py-3.5 last:border-b-0 sm:gap-4 sm:py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold tracking-tight text-[var(--navy-900)] sm:text-lg">
                        {row.level}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--ink-soft)]">
                        {row.experience}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums tracking-tight text-[var(--navy-900)] sm:text-lg">
                        {salaryAmount(row.amount)}
                      </p>
                      <p className="mt-0.5 text-[10px] tracking-wide text-[var(--ink-soft)]">
                        บาท / เดือน
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {skills.length > 0 ? (
            <section
              className={cn(
                salaryRows.length > 0 &&
                  "mt-6 border-t border-[var(--border)] pt-6 sm:mt-8 sm:pt-7",
              )}
            >
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase sm:mb-3.5">
                ทักษะที่ควรมี
              </h3>
              <ul className="space-y-2.5">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex gap-2.5 text-[14px] leading-snug text-[var(--ink)]"
                  >
                    <span
                      className={cn("mt-2 size-1.5 shrink-0 rounded-full", accent)}
                      aria-hidden
                    />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {!hasRight && item.detail ? (
            <p className="text-sm text-[var(--ink-soft)]">
              ยังไม่มีข้อมูลเงินเดือนหรือทักษะ
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
