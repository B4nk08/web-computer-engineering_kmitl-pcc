"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { studentWorkPhotos, type StudentWork } from "../types";

const PHOTO_MAX = 4;

function categoryBadgeClass(category: string): string {
  switch (category) {
    case "Software":
      return "bg-[#2f5fd6]/15 text-[#1d4ed8]";
    case "Hardware":
      return "bg-[#e07a3d]/15 text-[#b55320]";
    case "Hardware & Software":
      return "bg-[#14b8a6]/18 text-[#0f766e]";
    default:
      return "bg-[var(--navy-900)]/10 text-[var(--navy-900)]";
  }
}

export function StudentWorkDetailModal({
  item,
  onClose,
}: {
  item: StudentWork;
  onClose: () => void;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const photos = studentWorkPhotos(item).slice(0, PHOTO_MAX);
  const [index, setIndex] = useState(0);
  const current = photos[Math.min(index, Math.max(photos.length - 1, 0))];
  const multi = photos.length > 1;

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

  function go(delta: number) {
    setIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--navy-950)]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-5 lg:p-8"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_70px_rgba(10,18,41,0.28)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* หัวน้ำเงินอ่อน */}
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#e8eefc_0%,#dce6f8_55%,#d2dcf5_100%)] px-5 py-5 sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-[#2f5fd6]/12 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {item.year ? (
                  <span className="rounded-full bg-[#2f5fd6] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    ปี {item.year}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    categoryBadgeClass(item.subtitle),
                  )}
                >
                  {item.subtitle}
                </span>
              </div>
              <h2
                id={titleId}
                className="text-xl font-semibold tracking-tight text-[var(--navy-900)] sm:text-2xl"
              >
                {item.title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="ปิด"
              onClick={() => onCloseRef.current()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--navy-900)]/70 shadow-sm transition hover:bg-white hover:text-[var(--navy-900)]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* เนื้อหาขาว อ่านง่าย */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {current ? (
            <div className="group/modal-gallery relative mb-5 overflow-hidden rounded-xl bg-[var(--surface)] ring-1 ring-[var(--navy-900)]/8">
              <div className="aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {multi ? (
                <>
                  <button
                    type="button"
                    aria-label="รูปก่อนหน้า"
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--navy-900)]/70 text-white opacity-0 transition hover:bg-[var(--navy-900)] group-hover/modal-gallery:opacity-100"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="รูปถัดไป"
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--navy-900)]/70 text-white opacity-0 transition hover:bg-[var(--navy-900)] group-hover/modal-gallery:opacity-100"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex gap-1.5 bg-gradient-to-t from-black/50 to-transparent p-2.5 pt-8">
                    {photos.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        aria-label={`ดูรูปที่ ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={cn(
                          "relative size-12 shrink-0 overflow-hidden rounded-md ring-2 transition",
                          i === index
                            ? "ring-[#2f5fd6]"
                            : "ring-white/55 opacity-80 hover:opacity-100",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {item.detail ? (
            <section className="mb-5">
              <h3 className="mb-2 text-xs font-semibold tracking-[0.14em] text-[#2f5fd6] uppercase">
                เกี่ยวกับผลงาน
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                {item.detail}
              </p>
            </section>
          ) : null}

          {item.manual ? (
            <section className="mb-5 rounded-xl border border-[#2f5fd6]/15 bg-[#2f5fd6]/[0.06] p-4 sm:p-5">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#2f5fd6] uppercase">
                <FileText className="size-3.5" aria-hidden />
                คู่มือการใช้งาน
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                {item.manual}
              </p>
            </section>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {item.projectUrl ? (
              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-950)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--navy-900)]"
              >
                เข้าไปใช้งาน
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {item.manualUrl ? (
              <a
                href={item.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2f5fd6] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#244db3]"
              >
                ดาวน์โหลดคู่มือ PDF
                <FileText className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {!item.projectUrl && !item.manualUrl && !item.manual && !item.detail ? (
              <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีรายละเอียดเพิ่มเติม</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
