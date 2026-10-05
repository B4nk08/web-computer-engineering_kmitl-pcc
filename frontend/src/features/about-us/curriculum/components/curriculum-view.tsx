"use client";

import { LoadingRow } from "@/components/ui/loading-row";

import { useEffect, useState } from "react";
import { Building2, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AboutUsDocMeta,
  AboutUsFieldList,
  AboutUsStatBar,
} from "../../components/about-us-doc";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useCurricula } from "../hooks/use-curriculum";
import type { CurriculumProgram } from "../types";

const DEFAULT_CAMPUS =
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง คณะ/วิทยาเขต/วิทยาลัย วิทยาเขตชุมพรเขตรอุดมศักดิ์";

function CurriculumRow({
  program,
  open,
  onToggle,
}: {
  program: CurriculumProgram;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 text-left sm:px-5"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold leading-snug tracking-tight text-[var(--navy-900)] sm:text-lg">
              {program.title}
            </h2>
            {program.titleEn ? (
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)] sm:text-sm">
                {program.titleEn}
              </p>
            ) : null}
            {!open && program.summary.length > 0 ? (
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--ink-soft)] sm:text-xs">
                {program.summary.map((item) => (
                  <span key={item.label}>
                    <span className="font-semibold text-[var(--navy-900)]">{item.value}</span>
                    {" "}
                    {item.label}
                  </span>
                ))}
              </p>
            ) : !open ? (
              <p className="mt-2 text-[11px] text-[var(--ink-soft)] sm:text-xs">
                กดเพื่อดูรายละเอียดหลักสูตร
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
        {program.pdfUrl ? (
          <a
            href={program.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 mr-4 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--navy-900)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--navy-800)] sm:mr-5"
            onClick={(e) => e.stopPropagation()}
          >
            PDF
            <FileText className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] px-4 pb-5 sm:px-5">
          <AboutUsDocMeta icon={<Building2 className="size-3.5" aria-hidden />}>
            {program.location || DEFAULT_CAMPUS}
          </AboutUsDocMeta>
          <AboutUsStatBar items={program.summary} />
          {program.body ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--ink)]">
              {program.body}
            </p>
          ) : null}
          <AboutUsFieldList rows={program.fields} />
        </div>
      ) : null}
    </article>
  );
}

/**
 * หน้า /about-us/beng — listing หลักสูตร กดแถวเพื่อขยายรายละเอียด
 */
export function CurriculumView() {
  const { data, loading, error } = useCurricula();
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading || ready) return;
    if (data.length === 1) setOpenId(data[0].id);
    setReady(true);
  }, [loading, data, ready]);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="CURRICULUM"
        title="หลักสูตร"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingRow label="กำลังโหลดข้อมูลหลักสูตร..." />
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่ — เพิ่มได้ที่ Admin → หลักสูตร
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((program) => (
              <CurriculumRow
                key={program.id}
                program={program}
                open={openId === program.id}
                onToggle={() =>
                  setOpenId((current) => (current === program.id ? null : program.id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
