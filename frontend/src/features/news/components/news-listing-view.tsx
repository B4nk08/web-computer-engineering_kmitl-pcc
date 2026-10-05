"use client";

import { LoadingRow } from "@/components/ui/loading-row";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePublishedNews } from "../hooks/use-published-news";
import { NewsBody } from "./news-body";
import { NewsPageHeader } from "./news-page-header";
import { formatThaiDate } from "@/lib/format-date";
import type { NewsAudience, NewsItem } from "../types";

function newsDate(item: NewsItem) {
  return item.publishedAt || item.createdAt || "";
}

function sortNewest(items: NewsItem[]) {
  return [...items].sort((a, b) => {
    const aTime = Date.parse(newsDate(a)) || 0;
    const bTime = Date.parse(newsDate(b)) || 0;
    return bTime - aTime;
  });
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex items-start gap-4 py-4 transition-colors sm:gap-6"
    >
      <time
        dateTime={newsDate(item) || undefined}
        className="w-24 shrink-0 pt-0.5 text-xs font-medium text-[var(--ink-soft)] sm:w-28 sm:text-sm"
      >
        {formatThaiDate(newsDate(item)) || "—"}
      </time>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--navy-900)] sm:text-[15px]">
          {item.title}
        </h3>
        {item.body ? (
          <NewsBody
            text={item.body}
            className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]"
          />
        ) : null}
      </div>
      <ChevronRight
        className="mt-0.5 size-4 shrink-0 text-[var(--ink-soft)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--navy-900)]"
        aria-hidden
      />
    </Link>
  );
}

function FeaturedAdmission({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group block">
      <p className="text-xs font-medium text-[var(--ink-soft)]">
        {formatThaiDate(newsDate(item))}
      </p>
      <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[var(--ink)] group-hover:text-[var(--navy-900)] sm:text-xl">
        {item.title}
      </h2>
      {item.body ? (
        <NewsBody
          text={item.body}
          className="mt-3 max-w-3xl text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-8"
        />
      ) : null}
    </Link>
  );
}

function NewsListCard({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-[var(--ink)]/15 border-y border-[var(--ink)]/15">
      {items.map((item) => (
        <NewsRow key={item.id} item={item} />
      ))}
    </div>
  );
}

/**
 * หน้า /news (รับสมัคร = ข่าวเด่น + รายการ) และ /news/internal (รายการอย่างเดียว)
 */
export function NewsListingView({ audience }: { audience: NewsAudience }) {
  const { data, loading, error } = usePublishedNews(audience);
  const items = sortNewest(data);
  const featured = audience === "external" ? items[0] : null;
  const rest = audience === "external" ? items.slice(1) : items;

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-white">
      <NewsPageHeader audience={audience} />

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingRow label="กำลังโหลดประกาศ..." />
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีประกาศที่เผยแพร่ — เพิ่มได้ที่ Admin → ข่าวสาร
          </p>
        ) : audience === "external" ? (
          <div className="space-y-8">
            {featured ? <FeaturedAdmission item={featured} /> : null}
            {rest.length > 0 ? (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-[var(--ink)]">ประกาศก่อนหน้า</h2>
                <NewsListCard items={rest} />
              </section>
            ) : null}
          </div>
        ) : (
          <NewsListCard items={rest} />
        )}
      </div>
    </div>
  );
}
