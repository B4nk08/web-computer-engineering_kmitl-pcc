"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth";
import { isStudentRole } from "@/config/staff-role";
import { cn } from "@/lib/utils";
import { FacultyPageHeader } from "./faculty-page-header";
import { groupStudentsByYear, type StudentYearGroup } from "../students-by-year/group";
import { useClassmates } from "../students-by-year/hooks/use-classmates";

function YearHeading({ group }: { group: StudentYearGroup }) {
  const title = group.prefix
    ? `รหัส ${group.prefix}`
    : group.cohort
      ? group.cohort
      : "เพื่อนร่วมรุ่น";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold tracking-tight text-[var(--navy-900)] sm:text-lg">
          {title}
        </h2>
        {group.prefix && group.cohort ? (
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-[var(--navy-900)] ring-1 ring-[var(--border)]">
            {group.cohort}
          </span>
        ) : null}
      </div>
      <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium tabular-nums text-[var(--ink-soft)] ring-1 ring-[var(--border)]">
        {group.students.length} คน
      </span>
    </div>
  );
}

function NameDirectory({ group }: { group: StudentYearGroup }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="flex items-end justify-between gap-4 border-b border-[var(--ink)]/10 px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-medium text-[var(--ink-soft)]">เพื่อนร่วมรุ่น</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--navy-900)]">
            {group.cohort ?? "รายชื่อ"}
          </h2>
        </div>
        <p className="pb-0.5 text-sm tabular-nums text-[var(--ink-soft)]">{group.students.length} คน</p>
      </div>

      <ul>
        {group.students.map((student, index) => (
          <li
            key={student.id}
            className={cn(
              "flex items-center justify-between gap-3 px-5 py-3 text-[15px] sm:px-6",
              student.isSelf
                ? "bg-[var(--navy-900)]/[0.07] font-semibold text-[var(--navy-900)]"
                : index % 2 === 1
                  ? "bg-[var(--surface)] text-[var(--ink)]"
                  : "bg-white text-[var(--ink)]",
            )}
          >
            <span className="min-w-0 truncate">{student.fullName}</span>
            {student.isSelf ? (
              <span className="shrink-0 text-[11px] font-medium text-[var(--navy-900)]">คุณ</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StaffTable({ group }: { group: StudentYearGroup }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-5">
        <YearHeading group={group} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-white text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
              <th className="w-16 px-4 py-3 sm:px-5">ลำดับ</th>
              <th className="w-40 px-4 py-3 sm:px-5">รหัสนักศึกษา</th>
              <th className="px-4 py-3 sm:px-5">ชื่อ-นามสกุล</th>
            </tr>
          </thead>
          <tbody>
            {group.students.map((student, index) => (
              <tr
                key={student.id}
                className={cn(
                  "border-b border-[var(--border)] last:border-b-0",
                  student.isSelf
                    ? "bg-[var(--navy-900)]/[0.06]"
                    : (index + 1) % 2 === 0
                      ? "bg-[var(--surface)]/70"
                      : "bg-white",
                )}
              >
                <td className="px-4 py-3 text-sm tabular-nums text-[var(--ink-soft)] sm:px-5">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-nums text-[var(--navy-900)] sm:px-5">
                  {student.studentCode ?? "—"}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-[var(--ink)] sm:text-[15px]">
                      {student.fullName}
                    </span>
                    {student.isSelf ? (
                      <span className="rounded-full bg-[var(--navy-900)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                        คุณ
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * หน้า /faculty/students-by-year
 * นักศึกษาเห็นเฉพาะชื่อ · อาจารย์/แอดมินเห็นตารางพร้อมรหัส
 */
export function StudentsByYearListingView() {
  const { user } = useAuth();
  const { data, loading, error } = useClassmates();
  const groups = groupStudentsByYear(data);
  const namesOnly = isStudentRole(user?.role);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <FacultyPageHeader title="รายชื่อชั้นปี" subtitle="Students by Year" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดรายชื่อ...</span>
          </div>
        ) : error === "forbidden" ? (
          <p className="text-sm text-[var(--ink-soft)]">
            อีเมลนี้ไม่อยู่ในรายชื่อนักศึกษาสาขาวิศวกรรมคอมพิวเตอร์
          </p>
        ) : error === "missing_code" ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีรหัสนักศึกษาในระบบ จึงยังแยกรุ่นไม่ได้ — ติดต่อภาควิชาเพื่อเพิ่มรหัส เช่น 6620001
          </p>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">โหลดรายชื่อไม่สำเร็จ</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีรายชื่อเพื่อนร่วมรุ่นในระบบ</p>
        ) : (
          <div className="space-y-8">
            {groups.map((group) =>
              namesOnly ? (
                <NameDirectory key={group.prefix || group.cohort || "none"} group={group} />
              ) : (
                <StaffTable key={group.prefix || group.cohort || "none"} group={group} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
