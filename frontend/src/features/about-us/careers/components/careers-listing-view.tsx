"use client";

import { Loader2 } from "lucide-react";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useCareers } from "../hooks/use-careers";
import type { CareerPath } from "../types";

function CareerCard({ item }: { item: CareerPath }) {
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
            รูปอาชีพ
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.role ? (
          <p className="mb-1 text-[11px] font-medium text-[var(--ink-soft)]">{item.role}</p>
        ) : null}
        <h2 className="text-base font-semibold leading-snug text-[var(--ink)]">{item.title}</h2>
        {item.detail ? (
          <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
            {item.detail}
          </p>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </article>
  );
}

/**
 * หน้า /about-us/careers — อาชีพหลังจบการศึกษา
 */
export function CareersListingView() {
  const { data, loading, error } = useCareers();

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="CAREER PATH"
        title="เส้นทางอาชีพ"
        description="อาชีพที่บัณฑิตวิศวกรรมคอมพิวเตอร์สามารถเติบโตได้หลังจบการศึกษา"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดเส้นทางอาชีพ...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีเส้นทางอาชีพที่เผยแพร่ — เพิ่มได้ที่ Admin → เส้นทางอาชีพ
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <CareerCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
