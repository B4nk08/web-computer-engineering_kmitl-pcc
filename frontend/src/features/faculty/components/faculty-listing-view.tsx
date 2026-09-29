"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useHomeStaff } from "@/features/home";
import type { HomeStaffMember } from "@/features/home";
import { FacultyDetailModal } from "./faculty-detail-modal";
import { FacultyPageHeader } from "./faculty-page-header";

function FacultyCard({
  member,
  onOpen,
}: {
  member: HomeStaffMember;
  onOpen: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex cursor-pointer flex-col items-center rounded-xl border border-[var(--border)] bg-white px-4 py-5 text-center transition duration-300 hover:-translate-y-0.5 hover:border-[var(--navy-900)]/20 hover:shadow-[0_10px_24px_rgba(15,29,63,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-900)]/30"
    >
      <div className="size-28 overflow-hidden rounded-full bg-[var(--surface)] ring-4 ring-[var(--navy-900)]/8 sm:size-32">
        {member.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.imageUrl}
            alt=""
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--ink-soft)]">
            รูป
          </div>
        )}
      </div>
      <h2 className="mt-3 text-base font-semibold leading-snug whitespace-pre-line text-[var(--ink)]">
        {member.name}
      </h2>
    </article>
  );
}

/**
 * หน้า /faculty/facultyce — listing คณาจารย์ กว้างเท่าหน้า About Us
 */
export function FacultyListingView() {
  const { data, loading, error } = useHomeStaff();
  const [selected, setSelected] = useState<HomeStaffMember | null>(null);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <FacultyPageHeader title="คณาจารย์" subtitle="Faculty" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดบุคลากร...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีข้อมูลบุคลากรที่เผยแพร่ — เพิ่มได้ที่ Admin → คณาจารย์ / บุคลากร
          </p>
        ) : (
          <>
            <p className="mb-6 text-center text-sm text-[var(--ink-soft)]">
              อาจารย์ประจำสาขาวิชาวิศวกรรมคอมพิวเตอร์
              <span className="mx-2 text-[var(--border)]">/</span>
              {data.length} คน
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((member) => (
                <FacultyCard
                  key={member.id}
                  member={member}
                  onOpen={() => setSelected(member)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {selected ? (
        <FacultyDetailModal member={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
