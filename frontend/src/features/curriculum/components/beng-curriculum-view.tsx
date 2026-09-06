"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurriculum } from "../hooks/use-curriculum";

/**
 * หน้า /beng — UI เดิม เนื้อหาจาก API type=curriculum
 */
export function BengCurriculumView() {
  const { data, loading, error } = useCurriculum();

  if (loading) {
    return (
      <section className="bg-[var(--surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          <p className="text-sm text-[var(--ink-soft)]">กำลังโหลดข้อมูลหลักสูตร...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-[var(--surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          <p className="text-sm text-[var(--ink-soft)]">
            {error ?? "ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--surface)] py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8">
        <div className="rounded-2xl bg-[var(--navy-900)] p-6 text-white sm:p-10">
          <h1 className="text-xl font-semibold sm:text-2xl">{data.title}</h1>
          {data.titleEn ? (
            <p className="mt-1 text-sm text-white/70">{data.titleEn}</p>
          ) : null}

          {data.pdfUrl ? (
            <a
              href={data.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-white/80 underline-offset-4 hover:underline"
            >
              📄 ดาวน์โหลดรายละเอียดหลักสูตรฉบับเต็ม (PDF)
            </a>
          ) : null}

          <dl className="mt-8 divide-y divide-white/10 border-t border-white/10 text-sm">
            {data.fields.map((f) => (
              <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[260px_1fr] sm:gap-4">
                <dt className="text-white/60">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          {data.summary.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {data.summary.map((c) => (
                <div key={c.label} className="rounded-xl bg-white/10 p-4 text-center">
                  <p className="text-lg font-semibold">{c.value}</p>
                  <p className="mt-1 text-xs text-white/70">{c.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/admission-requirements">ดูคุณสมบัติผู้สมัคร</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
