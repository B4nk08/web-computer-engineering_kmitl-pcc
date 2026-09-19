"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useAdmissionsList } from "../hooks/use-admissions";
import type { AdmissionsInfo } from "../types";

function Step({
  n,
  title,
  hint,
  last,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--navy-900)] text-sm font-semibold text-white">
          {n}
        </span>
        {last ? null : <span className="mt-2 w-px flex-1 bg-[var(--border)]" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? "" : "pb-7"}`}>
        <h3 className="text-base font-semibold text-[var(--ink)] sm:text-lg">{title}</h3>
        {hint ? <p className="mt-1 text-sm text-[var(--ink-soft)]">{hint}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function ItemList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-sm leading-7 text-[var(--ink-soft)]">{empty}</p>;
  }

  return (
    <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-3 text-sm leading-7 text-[var(--ink)]">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--navy-900)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function roundFacts(item: AdmissionsInfo) {
  return [
    item.quota ? { label: "จำนวนรับ", value: item.quota } : null,
    item.tuition ? { label: "ค่าเทอม", value: item.tuition } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);
}

function AdmissionsRow({
  item,
  open,
  onToggle,
}: {
  item: AdmissionsInfo;
  open: boolean;
  onToggle: () => void;
}) {
  const facts = roundFacts(item);

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug tracking-tight text-[var(--navy-900)] sm:text-lg">
            {item.title}
          </h2>
          {item.titleEn ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)] sm:text-sm">
              {item.titleEn}
            </p>
          ) : null}
          {!open && facts.length > 0 ? (
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--ink-soft)] sm:text-xs">
              {facts.map((fact) => (
                <span key={fact.label}>
                  <span className="font-semibold text-[var(--navy-900)]">{fact.value}</span>{" "}
                  {fact.label}
                </span>
              ))}
            </p>
          ) : !open ? (
            <p className="mt-2 text-[11px] text-[var(--ink-soft)] sm:text-xs">
              กดเพื่อดูคุณสมบัติและเอกสารของรอบนี้
            </p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            "mt-1 size-5 shrink-0 text-[var(--ink-soft)] transition-transform duration-200",
            open && "rotate-180 text-[var(--navy-900)]",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-[var(--border)] px-4 py-5 sm:px-5">
          {facts.length > 0 ? (
            <dl
              className={
                facts.length > 1
                  ? "mb-8 grid grid-cols-2 overflow-hidden rounded-xl border border-[var(--border)]"
                  : "mb-8 overflow-hidden rounded-xl border border-[var(--border)] sm:max-w-[16rem]"
              }
            >
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="px-5 py-5 not-first:border-l not-first:border-[var(--border)] sm:px-8"
                >
                  <dt className="text-xs text-[var(--ink-soft)]">{fact.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight text-[var(--navy-900)]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {item.body ? (
            <p className="mb-8 whitespace-pre-line text-sm leading-7 text-[var(--ink-soft)]">
              {item.body}
            </p>
          ) : null}

          <Step n={1} title="ตรวจคุณสมบัติ" hint="ดูว่าตรงตามเกณฑ์การรับสมัครหรือไม่">
            <ItemList
              items={item.qualifications}
              empty="ยังไม่มีข้อมูลคุณสมบัติของรอบนี้"
            />
          </Step>

          <Step n={2} title="เตรียมเอกสาร" hint="เอกสารที่ใช้สมัครในแต่ละรอบอาจต่างกัน">
            <ItemList
              items={item.documents}
              empty="ยังไม่ระบุเอกสาร — ดูรายละเอียดจากประกาศรับสมัครในรอบนี้"
            />
          </Step>

          <Step n={3} title="สมัครเรียน" hint="เมื่อพร้อมแล้ว ส่งใบสมัครผ่านระบบรับสมัคร" last>
            {item.applyUrl ? (
              <a
                href={item.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-900)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--navy-800)]"
              >
                ไปหน้าสมัคร
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : (
              <p className="text-sm leading-7 text-[var(--ink-soft)]">
                ยังไม่มีลิงก์สมัครของรอบนี้ — ดูรายละเอียดได้ที่{" "}
                <Link
                  href="/news"
                  className="font-medium text-[var(--navy-900)] underline-offset-4 hover:underline"
                >
                  ประกาศรับสมัคร
                </Link>
              </p>
            )}
          </Step>
        </div>
      ) : null}
    </article>
  );
}

/**
 * หน้า /about-us/admission-requirements
 * listing ต่อรอบรับสมัคร กดแถวเพื่อขยายคู่มือ 3 ขั้น
 */
export function AdmissionsView() {
  const { data, loading, error } = useAdmissionsList();
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading || ready) return;
    if (data.length === 1) setOpenId(data[0].id);
    setReady(true);
  }, [loading, data, ready]);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader eyebrow="ADMISSIONS" title="คุณสมบัติ" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลด...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีรอบรับสมัครที่เผยแพร่ — เพิ่มได้ที่ Admin → ข้อมูลรับสมัคร เช่น TCAS 1
            Portfolio, โควตา
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <AdmissionsRow
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
