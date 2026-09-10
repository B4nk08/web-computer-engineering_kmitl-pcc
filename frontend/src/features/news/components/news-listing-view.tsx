"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AboutUsPageHeader } from "@/features/about-us";
import { usePublishedNews } from "../hooks/use-published-news";
import type { NewsAudience, NewsItem } from "../types";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--navy-900)]/25 hover:shadow-sm"
    >
      <div className="aspect-[16/9] overflow-hidden bg-[var(--surface)]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--ink-soft)]">
            ข่าวสาร
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={
              item.audience === "internal"
                ? "rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800"
                : "rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800"
            }
          >
            {item.audience === "internal" ? "ข่าวภายใน" : "ประกาศภายนอก"}
          </span>
          {item.publishedAt || item.createdAt ? (
            <span className="text-[11px] text-[var(--ink-soft)]">
              {formatDate(item.publishedAt || item.createdAt)}
            </span>
          ) : null}
        </div>
        <h2 className="text-base font-semibold leading-snug text-[var(--ink)]">{item.title}</h2>
        {item.body ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
            {item.body}
          </p>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </Link>
  );
}

const COPY: Record<
  "all" | NewsAudience,
  { eyebrow: string; title: string; description: string }
> = {
  all: {
    eyebrow: "NEWS",
    title: "ข่าวสาร",
    description: "ประกาศรับสมัครและข่าวภายในภาควิชา — แยกจากกิจกรรม",
  },
  external: {
    eyebrow: "EXTERNAL",
    title: "ประกาศภายนอก",
    description: "ประกาศสำหรับผู้สนใจเข้าศึกษา เช่น TCAS และรอบรับสมัคร",
  },
  internal: {
    eyebrow: "INTERNAL",
    title: "ข่าวภายใน",
    description: "ข่าวสารสำหรับนักศึกษาและบุคลากรภายในภาควิชา",
  },
};

/**
 * หน้า /news /news/external /news/internal
 */
export function NewsListingView({ audience }: { audience?: NewsAudience }) {
  const { data, loading, error } = usePublishedNews(audience);
  const copy = COPY[audience ?? "all"];

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดข่าวสาร...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีข่าวที่เผยแพร่ — เพิ่มได้ที่ Admin → ข่าวสาร
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
