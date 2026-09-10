"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AboutUsPageHeader } from "@/features/about-us";
import { getNews } from "../api";
import type { NewsItem } from "../types";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function NewsDetailView({ id }: { id: string }) {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getNews(id)
      .then((row) => {
        if (!alive) return;
        if (!row.isPublished) {
          setError("ข่าวนี้ยังไม่เผยแพร่");
          setItem(null);
          return;
        }
        setItem(row);
      })
      .catch(() => {
        if (!alive) return;
        setError("ไม่พบข่าวสารนี้");
        setItem(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const backHref =
    item?.audience === "internal"
      ? "/news/internal"
      : item?.audience === "external"
        ? "/news/external"
        : "/news";

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow={item?.audience === "internal" ? "INTERNAL" : "NEWS"}
        title={item?.title || "ข่าวสาร"}
        description={
          item
            ? `${item.audience === "internal" ? "ข่าวภายใน" : "ประกาศภายนอก"}${
                item.publishedAt || item.createdAt
                  ? ` — ${formatDate(item.publishedAt || item.createdAt)}`
                  : ""
              }`
            : "รายละเอียดข่าวสารภาควิชา"
        }
      />

      <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--navy-900)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          กลับไปข่าวสาร
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลด...</span>
          </div>
        ) : error || !item ? (
          <p className="text-sm text-[var(--ink-soft)]">{error ?? "ไม่พบข่าวสารนี้"}</p>
        ) : (
          <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.title} className="aspect-[16/8] w-full object-cover" />
            ) : null}
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {item.body ? (
                <p className="whitespace-pre-line text-sm leading-8 text-[var(--ink)] sm:text-[15px] sm:leading-9">
                  {item.body}
                </p>
              ) : (
                <p className="text-sm text-[var(--ink-soft)]">ไม่มีรายละเอียดเพิ่มเติม</p>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
