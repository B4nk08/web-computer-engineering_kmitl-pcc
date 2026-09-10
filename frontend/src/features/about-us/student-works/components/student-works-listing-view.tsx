"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useStudentWorks } from "../hooks/use-student-works";
import type { StudentWork } from "../types";

function StudentWorkCard({ item }: { item: StudentWork }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--navy-900)]/25 hover:shadow-sm">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--ink-soft)]">
            รูปผลงาน
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {item.year ? (
            <span className="rounded-full bg-[var(--navy-950)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              ปี {item.year}
            </span>
          ) : null}
          <span className="text-[11px] font-medium text-[var(--ink-soft)]">{item.subtitle}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-[var(--ink)]">{item.title}</h2>
        {item.detail ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
            {item.detail}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        {item.projectUrl ? (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--navy-950)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-900)]"
          >
            เข้าไปใช้งาน
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : (
          <p className="mt-4 text-xs text-[var(--ink-soft)]">ยังไม่มีลิงก์เข้าใช้งาน</p>
        )}
      </div>
    </article>
  );
}

/**
 * หน้า /about-us/student-works — listing กล่องผลงานปี 4 พร้อมลิงก์
 */
export function StudentWorksListingView() {
  const { data, loading, error } = useStudentWorks();

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="STUDENT WORKS"
        title="ผลงานนักศึกษา"
        description="โครงงานปี 4 และผลงานที่เผยแพร่ — กดปุ่มเข้าไปใช้งานเพื่อเปิดลิงก์ผลงานจริง"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดผลงาน...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีผลงานที่เผยแพร่ — เพิ่มได้ที่ Admin → ผลงานนักศึกษา
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <StudentWorkCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
