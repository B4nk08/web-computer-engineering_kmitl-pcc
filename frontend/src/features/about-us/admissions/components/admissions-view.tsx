"use client";

import { LoadingRow } from "@/components/ui/loading-row";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useAdmissionsList } from "../hooks/use-admissions";
import type { AdmissionBlock, AdmissionsInfo } from "../types";

function formatAmount(value: string): string {
  const n = Number(String(value).replace(/,/g, "").trim());
  if (!Number.isFinite(n)) return value;
  return n.toLocaleString("th-TH");
}

function DossierBlocks({ blocks }: { blocks: AdmissionBlock[] }) {
  return (
    <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`p-${index}`}
              className="text-sm leading-7 text-[var(--ink)] sm:text-[15px]"
            >
              {block.text}
            </p>
          );
        }
        if (block.type === "heading") {
          return (
            <p
              key={`h-${index}`}
              className="text-sm font-semibold leading-7 text-[var(--navy-900)] sm:text-[15px]"
            >
              {block.text}
            </p>
          );
        }
        return (
          <ul key={`b-${index}`} className="space-y-2.5">
            {block.items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex gap-3 text-sm leading-relaxed text-[var(--ink)] sm:text-[15px] sm:leading-7"
              >
                <span
                  className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--navy-900)]/70"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

function DossierList({
  heading,
  blocks,
  empty,
}: {
  heading: string;
  blocks: AdmissionBlock[];
  empty: string;
}) {
  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-4 py-3.5 sm:px-5">
        <span
          className="h-4 w-1 shrink-0 rounded-full bg-[var(--navy-900)]"
          aria-hidden
        />
        <h3 className="text-base font-semibold text-[var(--navy-900)]">
          {heading}
        </h3>
      </div>
      {blocks.length === 0 ? (
        <p className="px-4 py-4 text-sm leading-7 text-[var(--ink-soft)] sm:px-5">
          {empty}
        </p>
      ) : (
        <DossierBlocks blocks={blocks} />
      )}
    </section>
  );
}

function RoundDossier({ item }: { item: AdmissionsInfo }) {
  const hasMeta = Boolean(item.quota || item.tuition);

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[0_1px_0_rgba(15,29,63,0.03)]">
      <header className="relative px-5 py-6 sm:px-8 sm:py-8">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-[var(--navy-900)]"
          aria-hidden
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--ink-soft)] uppercase">
              รอบรับสมัคร
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--navy-900)] sm:text-2xl">
              {item.title}
            </h2>
            {item.titleEn ? (
              <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
                {item.titleEn}
              </p>
            ) : null}
            {item.body ? (
              <p className="mt-5 max-w-2xl border-l-2 border-[var(--navy-900)]/20 pl-4 text-sm leading-7 text-[var(--ink-soft)]">
                {item.body}
              </p>
            ) : null}
          </div>

          {hasMeta ? (
            <dl className="flex shrink-0 gap-8 sm:pt-1">
              {item.quota ? (
                <div>
                  <dt className="text-[11px] tracking-wide text-[var(--ink-soft)]">
                    จำนวนรับ
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-[var(--navy-900)]">
                    {formatAmount(item.quota)}
                    <span className="ml-1 text-sm font-normal text-[var(--ink-soft)]">
                      คน
                    </span>
                  </dd>
                </div>
              ) : null}
              {item.tuition ? (
                <div>
                  <dt className="text-[11px] tracking-wide text-[var(--ink-soft)]">
                    ค่าเทอม
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-[var(--navy-900)]">
                    {formatAmount(item.tuition)}
                    <span className="ml-1 text-sm font-normal text-[var(--ink-soft)]">
                      บาท
                    </span>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
      </header>

      <div className="border-t border-[var(--border)] bg-[var(--surface)]/50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-2">
          <DossierList
            heading="คุณสมบัติผู้เข้าศึกษา"
            blocks={item.qualifications}
            empty="ยังไม่มีข้อมูลคุณสมบัติของรอบนี้"
          />
          <DossierList
            heading="เอกสารที่ต้องเตรียม"
            blocks={item.documents}
            empty="ยังไม่ระบุเอกสาร — ดูรายละเอียดจากประกาศรับสมัครในรอบนี้"
          />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] px-5 py-4 sm:px-8">
        {item.applyUrl ? (
          <a
            href={item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--navy-900)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--navy-800)]"
          >
            ไปหน้าสมัคร
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : (
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--navy-900)] underline-offset-4 hover:underline"
          >
            ดูประกาศรับสมัคร
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        )}
      </footer>
    </article>
  );
}

/**
 * หน้า /about-us/admission-requirements
 * แบบ 1 Round dossier — เลือกรอบด้านบน แล้วดูเอกสารรอบนั้น
 */
export function AdmissionsView() {
  const { data, loading, error } = useAdmissionsList();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (loading || data.length === 0) return;
    setActiveId((current) => {
      if (current && data.some((item) => item.id === current)) return current;
      return data[0].id;
    });
  }, [loading, data]);

  const active = data.find((item) => item.id === activeId) ?? data[0] ?? null;

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader eyebrow="ADMISSIONS" title="คุณสมบัติ" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingRow label="กำลังโหลด..." />
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีรอบรับสมัครที่เผยแพร่ — เพิ่มได้ที่ Admin → ข้อมูลรับสมัคร
            เช่น TCAS 1 Portfolio, โควตา
          </p>
        ) : (
          <div className="space-y-5">
            {data.length > 1 ? (
              <nav
                aria-label="เลือกรอบรับสมัคร"
                className="flex flex-wrap gap-x-1 gap-y-2 border-b border-[var(--border)]"
              >
                {data.map((item) => {
                  const selected = item.id === active?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        "-mb-px border-b-2 px-3 py-2.5 text-sm transition sm:px-4",
                        selected
                          ? "border-[var(--navy-900)] font-semibold text-[var(--navy-900)]"
                          : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]",
                      )}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </nav>
            ) : null}

            {active ? <RoundDossier item={active} /> : null}
          </div>
        )}
      </div>
    </div>
  );
}
