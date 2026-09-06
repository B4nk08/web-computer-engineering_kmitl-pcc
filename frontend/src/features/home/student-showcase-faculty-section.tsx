"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomeShowcase, useHomeStaff } from "./hooks/use-home-contents";
import type { HomeShowcaseItem, HomeStaffMember } from "./types";

/**
 * student-showcase-faculty-section.tsx
 * --------------------------------------
 * ส่วนล่างสุดของหน้า Home: "Student Showcase" และ "Faculty"
 * เนื้อหาดึงจาก API (content type: student_work / staff) — UI เดิมคงไว้
 */

function ScrollRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="เลื่อนไปทางซ้าย"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-md ring-1 ring-black/5 hover:bg-[var(--muted)] sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div ref={ref} className={`no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 ${className}`}>
        {children}
      </div>
      <button
        type="button"
        aria-label="เลื่อนไปทางขวา"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-md ring-1 ring-black/5 hover:bg-[var(--muted)] sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function ShowcaseCard({ item }: { item: HomeShowcaseItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-64 shrink-0 rounded-2xl bg-[var(--navy-900)] p-4 text-white transition-transform duration-200 hover:-translate-y-1.5">
      <div className="mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-white/10 text-xs text-white/60">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          "รูปผลงาน"
        )}
      </div>
      <p className="text-xs font-medium text-white/60">{item.subtitle}</p>
      <h4 className="mt-1 text-sm font-semibold">{item.title}</h4>
      {expanded && <p className="mt-2 text-xs leading-relaxed text-white/70">{item.detail}</p>}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs font-medium text-[var(--accent)] underline-offset-4 hover:underline"
      >
        {expanded ? "ย่อรายละเอียด" : "รายละเอียดเพิ่มเติม"}
      </button>
    </div>
  );
}

function FacultyCard({ member }: { member: HomeStaffMember }) {
  return (
    <div className="w-40 shrink-0 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-1.5">
      <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-[#d9d9d9]">
        {member.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <p className="text-sm font-semibold text-[var(--ink)]">{member.name}</p>
      <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{member.position}</p>
    </div>
  );
}

export function StudentShowcaseFacultySection() {
  const showcase = useHomeShowcase();
  const staff = useHomeStaff();

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        {/* Student Showcase */}
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">Student Showcase</h2>
          </div>
          {showcase.loading ? (
            <p className="text-sm text-[var(--ink-soft)]">กำลังโหลด...</p>
          ) : showcase.data.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีผลงานที่เผยแพร่</p>
          ) : (
            <ScrollRow>
              {showcase.data.map((item) => (
                <ShowcaseCard key={item.id} item={item} />
              ))}
            </ScrollRow>
          )}
        </div>

        {/* Faculty */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">Faculty</h2>
            <a
              href="/faculty"
              className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
            >
              ดูทั้งหมด →
            </a>
          </div>
          {staff.loading ? (
            <p className="text-sm text-[var(--ink-soft)]">กำลังโหลด...</p>
          ) : staff.data.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีข้อมูลอาจารย์ที่เผยแพร่</p>
          ) : (
            <ScrollRow>
              {staff.data.map((member) => (
                <FacultyCard key={member.id} member={member} />
              ))}
            </ScrollRow>
          )}
        </div>
      </div>
    </section>
  );
}
