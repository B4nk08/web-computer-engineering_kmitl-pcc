"use client";

import { Building2, FileText, Loader2 } from "lucide-react";
import { useCurriculum } from "../hooks/use-curriculum";

const DEFAULT_CAMPUS =
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง คณะ/วิทยาเขต/วิทยาลัย วิทยาเขตชุมพรเขตรอุดมศักดิ์";

/**
 * หน้า /about-us/beng — โทนเอกสารหลักสูตร คอลัมน์อ่านแคบ ไม่ยืดการ์ดเต็มจอ
 */
export function BengCurriculumView() {
  const { data, loading, error } = useCurriculum();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[var(--surface)] pt-16">
        <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
        <span className="ml-2 text-sm text-[var(--ink-soft)]">
          กำลังโหลดข้อมูลหลักสูตร...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)] px-4 py-12 pt-20 text-center">
        <p className="text-sm text-[var(--ink-soft)]">
          {error ?? "ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[720px] px-4 pb-14 pt-20 sm:px-6">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-snug tracking-tight text-[var(--navy-900)] sm:text-xl">
              {data.title}
            </h1>
            {data.titleEn ? (
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)] sm:text-sm">
                {data.titleEn}
              </p>
            ) : null}
          </div>

          {data.pdfUrl ? (
            <a
              href={data.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--navy-900)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-800)] sm:text-sm"
            >
              PDF
              <FileText className="size-3.5" aria-hidden />
            </a>
          ) : null}
        </header>

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-[var(--ink-soft)] sm:text-xs">
          <Building2
            className="mt-0.5 size-3.5 shrink-0 text-[var(--navy-900)]/45"
            aria-hidden
          />
          <span>{DEFAULT_CAMPUS}</span>
        </p>

        {data.summary.length > 0 ? (
          <div className="mt-5 flex divide-x divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white">
            {data.summary.map((c) => (
              <div key={c.label} className="flex-1 px-3 py-3 text-center sm:px-4">
                <p className="text-base font-semibold tracking-tight text-[var(--navy-900)] sm:text-lg">
                  {c.value}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--ink-soft)] sm:text-xs">
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <section className="mt-4 rounded-xl border border-[var(--border)] bg-white">
          <dl className="divide-y divide-[var(--border)] text-sm">
            {data.fields.map((f) => (
              <div key={f.label} className="px-4 py-3 sm:px-5">
                <dt className="text-xs text-[var(--ink-soft)]">{f.label}</dt>
                <dd className="mt-0.5 font-medium leading-relaxed text-[var(--ink)]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
