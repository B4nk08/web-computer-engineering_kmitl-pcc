"use client";

import Link from "next/link";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { useAdmissions } from "../hooks/use-admissions";

/**
 * หน้า /about-us/admission-requirements
 * หัวข้อแบบเดิม — เนื้อหาเรียบ ไม่ห่อกล่อง
 */
export function AdmissionsView() {
  const { data, loading } = useAdmissions();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[var(--surface)] pt-16">
        <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
        <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลด...</span>
      </div>
    );
  }

  const highlights = [
    data.quota ? { label: "จำนวนรับ", value: data.quota } : null,
    data.tuition ? { label: "ค่าเทอม", value: data.tuition } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <header className="border-b border-black/5 bg-white pt-20 sm:pt-24">
        <div className="mx-auto max-w-[900px] px-4 pb-8 sm:px-6 sm:pb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy-900)]/70">
                ADMISSIONS
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
                คุณสมบัติผู้สมัคร
              </h1>
              <div className="mt-3 h-1 w-12 rounded-full bg-[var(--navy-900)]" />

              <p className="mt-5 text-base font-semibold leading-relaxed text-[var(--ink)] sm:text-lg">
                {data.title}
              </p>
              {data.titleEn ? (
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{data.titleEn}</p>
              ) : null}
              {data.body ? (
                <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
                  {data.body}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href="/about-us/beng"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--navy-950)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--navy-900)]"
              >
                <FileText className="size-4" aria-hidden />
                ดูหลักสูตร
              </Link>
              {data.applyUrl ? (
                <a
                  href={data.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--navy-950)]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[var(--navy-950)] transition hover:border-[var(--navy-950)]/40"
                >
                  สมัครเรียน
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>

          {highlights.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/5 sm:max-w-md">
              {highlights.map((h) => (
                <div key={h.label} className="bg-white px-5 py-4">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--ink-soft)]">
                    {h.label}
                  </dt>
                  <dd className="mt-1 text-xl font-semibold tracking-tight text-[var(--navy-900)]">
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                คุณสมบัติของผู้เข้าศึกษา
              </h2>
              {data.qualifications.length > 0 ? (
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
                  {data.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-[var(--ink-soft)]">
                  ยังไม่มีข้อมูลคุณสมบัติ — เพิ่มได้ที่ Admin → ข้อมูลรับสมัคร
                </p>
              )}
            </section>

            {data.documents.length > 0 ? (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                  เอกสารที่ต้องใช้
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
                  {data.documents.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
              การดูแลนักศึกษาแรกเข้า
            </h2>
            {data.supportItems.length > 0 ? (
              <ul className="space-y-5">
                {data.supportItems.map((item, i) => (
                  <li key={`${item.title}-${i}`}>
                    <p className="text-sm font-semibold text-[var(--ink)] sm:text-[15px]">
                      {item.title}
                    </p>
                    {item.detail ? (
                      <p className="mt-1 text-sm leading-8 text-[var(--ink-soft)] sm:leading-9">
                        {item.detail}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--ink-soft)]">
                ยังไม่มีข้อมูลการดูแลนักศึกษาแรกเข้า
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
