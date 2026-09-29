"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useStudentWorks } from "../hooks/use-student-works";
import {
  STUDENT_WORK_CATEGORIES,
  studentWorkPhotos,
  type StudentWork,
} from "../types";
import { StudentWorkDetailModal } from "./student-work-detail-modal";

const PHOTO_MAX = 4;

const CATEGORY_TONE: Record<
  string,
  { chip: string; chipActive: string; badge: string }
> = {
  Software: {
    chip: "text-[#1d4ed8] hover:bg-[#2f5fd6]/10",
    chipActive: "bg-[#2f5fd6] text-white shadow-[0_6px_16px_rgba(47,95,214,0.28)]",
    badge: "bg-[#2f5fd6]/12 text-[#1d4ed8]",
  },
  Hardware: {
    chip: "text-[#c45c26] hover:bg-[#e07a3d]/12",
    chipActive: "bg-[#e07a3d] text-white shadow-[0_6px_16px_rgba(224,122,61,0.28)]",
    badge: "bg-[#e07a3d]/12 text-[#b55320]",
  },
  "Hardware & Software": {
    chip: "text-[#0f766e] hover:bg-[#14b8a6]/12",
    chipActive: "bg-[#0d9488] text-white shadow-[0_6px_16px_rgba(13,148,136,0.28)]",
    badge: "bg-[#14b8a6]/14 text-[#0f766e]",
  },
  Other: {
    chip: "text-[var(--navy-800)] hover:bg-[var(--navy-900)]/8",
    chipActive: "bg-[var(--navy-900)] text-white shadow-[0_6px_16px_rgba(16,29,63,0.22)]",
    badge: "bg-[var(--navy-900)]/8 text-[var(--navy-900)]",
  },
};

function categoryTone(category: string) {
  return CATEGORY_TONE[category] ?? CATEGORY_TONE.Other;
}


function GalleryPane({
  photos,
  alt,
  onImageClick,
}: {
  photos: string[];
  alt: string;
  onImageClick?: () => void;
}) {
  const slides = photos.slice(0, PHOTO_MAX);
  const [active, setActive] = useState(0);
  const multi = slides.length > 1;
  const index = Math.min(active, Math.max(slides.length - 1, 0));
  const current = slides[index];

  if (!current) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-[var(--surface)] text-xs text-[var(--ink-soft)]">
        รูปผลงาน
      </div>
    );
  }

  function go(delta: number) {
    setActive((prev) => {
      const next = prev + delta;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }

  return (
    <div
      className="group/gallery relative aspect-[16/10] overflow-hidden bg-[var(--surface)]"
      onClick={onImageClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        className="h-full w-full object-cover transition duration-300"
      />

      {multi ? (
        <>
          <button
            type="button"
            aria-label="รูปก่อนหน้า"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className={cn(
              "absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full",
              "bg-black/45 text-white shadow-sm backdrop-blur-sm transition",
              "opacity-0 hover:bg-black/60 group-hover/gallery:opacity-100",
              "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
            )}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="รูปถัดไป"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className={cn(
              "absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full",
              "bg-black/45 text-white shadow-sm backdrop-blur-sm transition",
              "opacity-0 hover:bg-black/60 group-hover/gallery:opacity-100",
              "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
            )}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 flex gap-1.5 bg-gradient-to-t from-black/45 to-transparent p-2.5 pt-8">
            {slides.map((src, i) => {
              const selected = i === index;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  aria-label={`ดูรูปที่ ${i + 1}`}
                  aria-current={selected}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={cn(
                    "relative size-11 shrink-0 overflow-hidden rounded-md ring-2 transition sm:size-12",
                    selected
                      ? "ring-white"
                      : "ring-white/50 opacity-80 hover:opacity-100 hover:ring-white/80",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

function StudentWorkCard({
  item,
  onOpen,
}: {
  item: StudentWork;
  onOpen: () => void;
}) {
  const photos = studentWorkPhotos(item);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-[var(--navy-900)]/25 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-900)]/30"
    >
      <GalleryPane photos={photos} alt={item.title} onImageClick={onOpen} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {item.year ? (
            <span className="rounded-full bg-[var(--navy-950)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              ปี {item.year}
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              categoryTone(item.subtitle).badge,
            )}
          >
            {item.subtitle}
          </span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-[var(--ink)] sm:text-lg">
          {item.title}
        </h2>
        {item.detail ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
            {item.detail}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.projectUrl ? (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--navy-950)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-900)]"
            >
              เข้าไปใช้งาน
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : (
            <p className="text-xs text-[var(--ink-soft)]">ยังไม่มีลิงก์เข้าใช้งาน</p>
          )}
          <span className="text-xs font-medium text-[#2f5fd6] opacity-0 transition group-hover:opacity-100">
            ดูรายละเอียด →
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * หน้า /about-us/student-works — กริด 3 คอลัมน์ + รูปใหญ่/ลูกศร/preview ทับรูป + หมวด + ค้นหา
 */
export function StudentWorksListingView() {
  const { data, loading, error } = useStudentWorks();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<StudentWork | null>(null);

  const categories = useMemo((): string[] => {
    const present = new Set(data.map((item) => item.subtitle).filter(Boolean));
    const known = STUDENT_WORK_CATEGORIES.filter((c) => present.has(c));
    const extra = [...present].filter(
      (c) => !(STUDENT_WORK_CATEGORIES as readonly string[]).includes(c),
    );
    return [...known, ...extra];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      if (category !== "all" && item.subtitle !== category) return false;
      if (!q) return true;
      const haystack = [item.title, item.detail, item.subtitle, item.year]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, category, query]);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader eyebrow="STUDENT WORKS" title="ผลงานนักศึกษา" />

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
          <>
            <div className="mb-8 space-y-5">
              <div className="relative mx-auto max-w-md">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 shadow-[0_8px_24px_rgba(47,95,214,0.06)] transition",
                    query
                      ? "border-[#2f5fd6]/35 ring-4 ring-[#2f5fd6]/10"
                      : "border-[var(--border)] hover:border-[#2f5fd6]/25",
                  )}
                >
                  <Search
                    className="size-4 shrink-0 text-[#2f5fd6]"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ค้นหาผลงาน..."
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] [&::-webkit-search-cancel-button]:hidden"
                  />
                  {query ? (
                    <button
                      type="button"
                      aria-label="ล้างคำค้น"
                      onClick={() => setQuery("")}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2f5fd6]/10 text-[#2f5fd6] transition hover:bg-[#2f5fd6]/18"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                    category === "all"
                      ? "bg-[var(--navy-950)] text-white shadow-[0_6px_16px_rgba(10,18,41,0.22)]"
                      : "bg-white text-[var(--ink-soft)] ring-1 ring-[var(--border)] hover:text-[var(--ink)]",
                  )}
                >
                  ทั้งหมด
                </button>
                {categories.map((c) => {
                  const tone = categoryTone(c);
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                        active ? tone.chipActive : cn("bg-white ring-1 ring-[var(--border)]", tone.chip),
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {(query || category !== "all") && (
                <p className="text-center text-xs text-[var(--ink-soft)]">
                  พบ{" "}
                  <span className="font-semibold text-[#2f5fd6]">
                    {filtered.length}
                  </span>{" "}
                  ผลงาน
                </p>
              )}
            </div>

            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--ink-soft)]">
                ไม่พบผลงานที่ตรงกับคำค้นหรือหมวดที่เลือก
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <StudentWorkCard
                    key={item.id}
                    item={item}
                    onOpen={() => setSelected(item)}
                  />
                ))}
              </div>
            )}

            {selected ? (
              <StudentWorkDetailModal
                item={selected}
                onClose={() => setSelected(null)}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
