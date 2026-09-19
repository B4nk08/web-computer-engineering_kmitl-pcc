"use client";

import { Loader2 } from "lucide-react";
import { useHomeStaff } from "@/features/home";
import type { HomeStaffMember } from "@/features/home";
import { FacultyPageHeader } from "./faculty-page-header";

function FacultyCard({ member }: { member: HomeStaffMember }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--navy-900)]/25 hover:shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-full bg-[var(--surface)] ring-1 ring-black/5">
          {member.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.imageUrl}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] text-[var(--ink-soft)]">
              รูป
            </div>
          )}
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-base font-semibold leading-snug text-[var(--ink)]">
            {member.name}
          </h2>
          {member.position ? (
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{member.position}</p>
          ) : null}
        </div>
      </div>
      {member.bio ? (
        <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
          {member.bio}
        </p>
      ) : (
        <div className="flex-1" />
      )}
    </article>
  );
}

/**
 * หน้า /faculty/facultyce — listing คณาจารย์ กว้างเท่าหน้า About Us
 */
export function FacultyListingView() {
  const { data, loading, error } = useHomeStaff();

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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((member) => (
              <FacultyCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
