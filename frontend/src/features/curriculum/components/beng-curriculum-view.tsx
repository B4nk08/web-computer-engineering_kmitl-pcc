"use client";

import { Building2, FileText, Loader2 } from "lucide-react";
import { useCurriculum } from "../hooks/use-curriculum";

const DEFAULT_CAMPUS =
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง คณะ/วิทยาเขต/วิทยาลัย วิทยาเขตชุมพรเขตรอุดมศักดิ์";

/**
 * หน้า /beng — หัวข้อเต็มความกว้าง + ปุ่ม PDF จาก DB + รายละเอียดหลักสูตร
 */
export function BengCurriculumView() {
  const { data, loading, error } = useCurriculum();

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white py-24">
        <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
        <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดข้อมูลหลักสูตร...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white px-4 py-16 text-center">
        <p className="text-sm text-[var(--ink-soft)]">
          {error ?? "ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่"}
        </p>
      </div>
    );
  }

  const campusLine = DEFAULT_CAMPUS;

  return (
    <div className="bg-white">
      {/* หัวข้อหน้า */}
      <header className="bg-[var(--navy-950)] text-white">
        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-8 sm:py-12 md:py-14">
          <h1 className="max-w-4xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl md:text-[2rem]">
            {data.title}
          </h1>
          {data.titleEn ? (
            <p className="mt-2 max-w-3xl text-sm text-white/75 sm:text-base">{data.titleEn}</p>
          ) : null}

          <div className="mt-10 flex flex-col gap-5 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
            <p className="flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-white/80 sm:text-sm">
              <Building2 className="mt-0.5 size-4 shrink-0 text-white/70" aria-hidden />
              <span>{campusLine}</span>
            </p>

            {data.pdfUrl ? (
              <a
                href={data.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--navy-950)] shadow-sm transition hover:bg-white/90 sm:self-auto"
              >
                PDF
                <FileText className="size-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {/* รายละเอียด */}
      <section className="px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1000px]">
          <div className="rounded-2xl bg-[var(--navy-900)] p-5 text-white shadow-lg sm:p-8">
            <dl className="divide-y divide-white/15 text-sm">
              {data.fields.map((f) => (
                <div
                  key={f.label}
                  className="grid gap-1 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(200px,280px)_1fr] sm:gap-6"
                >
                  <dt className="text-white/65">{f.label}</dt>
                  <dd className="font-medium leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {data.summary.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {data.summary.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl bg-[var(--navy-900)] px-4 py-5 text-center text-white shadow-md"
                >
                  <p className="text-xl font-semibold tracking-tight sm:text-2xl">{c.value}</p>
                  <p className="mt-1.5 text-xs text-white/70 sm:text-sm">{c.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
