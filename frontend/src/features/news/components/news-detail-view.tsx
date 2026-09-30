"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireMember } from "@/components/layout/require-member";
import { getNews } from "../api";
import { NewsBody } from "./news-body";
import { NewsImage } from "./news-image";
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

  const isInternal = item?.audience === "internal";
  const backHref = isInternal ? "/news/internal" : "/news";
  const sectionLabel = isInternal ? "ประกาศภายในสาขา" : "ประกาศรับสมัคร";

  const page = (
    <div className="min-h-[calc(100svh-4rem)] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-10 sm:px-6 sm:pt-12">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] transition hover:text-[var(--navy-900)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {sectionLabel}
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลด...</span>
          </div>
        ) : error || !item ? (
          <p className="text-sm text-[var(--ink-soft)]">{error ?? "ไม่พบข่าวสารนี้"}</p>
        ) : (
          <article>
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--ink)] pb-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ink)]">
                News
              </p>
              {(item.publishedAt || item.createdAt) && (
                <time className="text-right text-xs text-[var(--ink-soft)] sm:text-sm">
                  {formatDate(item.publishedAt || item.createdAt)}
                </time>
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--ink-soft)]">{sectionLabel}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-[40px] sm:leading-[1.15]">
              {item.title}
            </h1>

            {item.imageUrl ? <NewsImage src={item.imageUrl} alt={item.title} /> : null}

            <div className="mt-8 max-w-3xl border-t border-[var(--ink)]/15 pt-8">
              {item.body ? (
                <NewsBody
                  text={item.body}
                  className="text-sm leading-8 text-[var(--ink)] sm:text-[15px] sm:leading-8"
                />
              ) : (
                <p className="text-sm text-[var(--ink-soft)]">ไม่มีรายละเอียดเพิ่มเติม</p>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );

  if (!loading && isInternal) {
    return (
      <RequireMember description="ประกาศภายในสาขา เห็นเฉพาะนักศึกษาและบุคลากรที่เข้าสู่ระบบแล้ว">
        {page}
      </RequireMember>
    );
  }

  return page;
}
