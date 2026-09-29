"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { GraduationCap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HomeStaffMember, StaffEducationLevel } from "@/features/home";

const LEVEL_LABEL: Record<StaffEducationLevel, string> = {
  doctorate: "ปริญญาเอก",
  master: "ปริญญาโท",
  bachelor: "ปริญญาตรี",
};

const LEVEL_DOT: Record<StaffEducationLevel, string> = {
  doctorate: "bg-[var(--navy-900)] ring-[var(--navy-900)]/15",
  master: "bg-[#2f5fd6] ring-[#2f5fd6]/15",
  bachelor: "bg-[#8aa4d6] ring-[#8aa4d6]/20",
};

export function FacultyDetailModal({
  member,
  onClose,
}: {
  member: HomeStaffMember;
  onClose: () => void;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  if (typeof document === "undefined") return null;

  const hasEducation = member.education.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--navy-950)]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_70px_rgba(10,18,41,0.22)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-[var(--navy-900)] px-6 pt-6 pb-5 text-white sm:px-8 sm:pt-8">
          <div
            className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-white/[0.06]"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="ปิด"
          >
            <X className="size-4" />
          </button>

          <div className="relative flex items-center gap-4 pr-8">
            <div className="size-20 shrink-0 overflow-hidden rounded-full bg-white/10 ring-4 ring-white/15">
              {member.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.imageUrl}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/60">
                  รูป
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg leading-snug font-semibold whitespace-pre-line sm:text-xl"
              >
                {member.name}
              </h2>
              {member.position ? (
                <p className="mt-1 text-sm text-white/75">{member.position}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="flex items-center gap-2 text-[var(--navy-900)]">
            <GraduationCap className="size-4" aria-hidden />
            <h3 className="text-sm font-semibold">ประวัติการศึกษา</h3>
          </div>

          {hasEducation ? (
            <ol className="relative mt-4 space-y-5 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-[var(--border)]">
              {member.education.map((edu, index) => (
                <li key={`${edu.level}-${index}`} className="relative">
                  <span
                    className={cn(
                      "absolute top-1.5 -left-6 size-[11px] rounded-full ring-4",
                      LEVEL_DOT[edu.level],
                    )}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="text-xs font-medium text-[var(--ink-soft)]">
                      {LEVEL_LABEL[edu.level]}
                    </p>
                    {edu.year ? (
                      <p className="text-xs tabular-nums text-[var(--ink-soft)]">
                        สำเร็จปี {edu.year}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[15px] leading-snug font-semibold text-[var(--ink)]">
                    {edu.degree}
                  </p>
                  {edu.institution ? (
                    <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{edu.institution}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 rounded-xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-soft)]">
              ยังไม่มีข้อมูลประวัติการศึกษา
            </p>
          )}

          {member.bio ? (
            <div className="mt-7 border-t border-[var(--border)] pt-5">
              <h3 className="text-sm font-semibold text-[var(--navy-900)]">เกี่ยวกับอาจารย์</h3>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-[var(--ink-soft)]">
                {member.bio}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
