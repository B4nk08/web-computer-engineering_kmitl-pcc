"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { usePublishedNews } from "@/features/news/hooks/use-published-news";
import type { NewsItem } from "@/features/news";
import { SectionHeading } from "@/components/layout/section-heading";
import { formatThaiDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { WaveDivider } from "./section-divider";

const NEW_WITHIN_DAYS = 14;
const MAX_ITEMS = 3;

const COVER_TONES = [
  "from-[var(--navy-950)] via-[var(--navy-900)] to-[#2f5fd6]",
  "from-[var(--navy-900)] via-[#1f3b8a] to-[#0d9488]",
  "from-[var(--navy-950)] via-[#3a2a6b] to-[#e07a3d]",
];

const GRID_COLS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

function newsDate(item: NewsItem) {
  return item.publishedAt || item.createdAt || "";
}

function isRecent(iso: string) {
  const time = Date.parse(iso);
  if (!time) return false;
  return Date.now() - time < NEW_WITHIN_DAYS * 24 * 60 * 60 * 1000;
}

function excerpt(body: string) {
  return body.replace(/\s+/g, " ").trim();
}

/** "TCAS 2 - Quota" → { main: "TCAS 2", sub: "Quota" } */
function coverLabel(title: string) {
  const [main, ...rest] = title.split(/\s+[-–—:]\s+/);
  return { main: main.trim(), sub: rest.join(" ").trim() };
}

function NewsCover({ item, index }: { item: NewsItem; index: number }) {
  if (item.imageUrl) {
    return (
      <div className="aspect-[16/9] overflow-hidden bg-[var(--surface)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const { main, sub } = coverLabel(item.title);
  return (
    <div
      className={cn(
        "relative flex aspect-[16/9] flex-col justify-end overflow-hidden bg-gradient-to-br p-5 text-white",
        COVER_TONES[index % COVER_TONES.length],
      )}
    >
      <span className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full border-[18px] border-white/10 transition duration-500 group-hover:scale-110" aria-hidden />
      <span className="pointer-events-none absolute top-6 right-16 size-10 rounded-full bg-white/10" aria-hidden />
      <p className="relative text-3xl font-bold tracking-tight sm:text-4xl">{main}</p>
      {sub ? <p className="relative mt-1 text-sm font-medium text-white/80">{sub}</p> : null}
    </div>
  );
}

function NewsCard({
  item,
  index,
  latest,
  wide,
}: {
  item: NewsItem;
  index: number;
  latest: boolean;
  wide: boolean;
}) {
  const date = newsDate(item);
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,29,63,0.12)]",
        wide && "md:flex-row",
      )}
    >
      <div className={cn(wide && "md:w-1/2 md:shrink-0")}>
        <NewsCover item={item} index={index} />
      </div>
      {latest ? (
        <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--navy-900)] shadow-sm">
          ล่าสุด
        </span>
      ) : null}

      <div className={cn("flex flex-1 flex-col p-5", wide && "md:p-8")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)]">
          {isRecent(date) ? (
            <span className="rounded-full bg-[#e07a3d] px-2 py-0.5 text-[11px] font-semibold text-white">
              ใหม่
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatThaiDate(date)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--navy-900)]">
          {item.title}
        </h3>
        {item.body ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
            {excerpt(item.body)}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-[var(--navy-900)]">
          อ่านประกาศ
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** ประกาศรับสมัครล่าสุด 3 รายการ — ซ่อนทั้งส่วนถ้ายังไม่มีประกาศ */
export function LatestNewsSection() {
  const { data, loading } = usePublishedNews("external");

  if (loading) return null;

  const items = [...data]
    .sort((a, b) => (Date.parse(newsDate(b)) || 0) - (Date.parse(newsDate(a)) || 0))
    .slice(0, MAX_ITEMS);

  if (items.length === 0) return null;

  return (
    <>
      <section className="bg-[var(--surface)] pt-12 pb-6 sm:pt-16 sm:pb-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <SectionHeading
            eyebrow="Admissions News"
            title="ประกาศล่าสุด"
            href="/news"
            action="pill"
          />

          <div className={cn("grid gap-5", GRID_COLS[items.length])}>
            {items.map((item, index) => (
              <NewsCard
                key={item.id}
                item={item}
                index={index}
                latest={index === 0}
                wide={items.length === 1}
              />
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="surface" to="white" />
    </>
  );
}
