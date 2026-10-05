"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { clusterTheme } from "@/config/cluster-theme";
import { SectionHeading } from "@/components/layout/section-heading";
import { useCareers } from "@/features/about-us";
import { cn } from "@/lib/utils";

const MAX_CHIPS = 3;

/** กลุ่มสายงานจาก career_clusters — กดแล้วไปหน้าเส้นทางอาชีพ */
export function CareerClustersSection() {
  const { data: careers, clusters, loading } = useCareers();

  if (loading || clusters.length === 0) return null;

  const titlesByCode = careers.reduce<Record<string, string[]>>((acc, career) => {
    if (career.clusterCode && career.title) {
      (acc[career.clusterCode] ??= []).push(career.title);
    }
    return acc;
  }, {});

  const sorted = [...clusters].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Career Path"
          title="เรียนจบแล้วทำงานอะไรได้บ้าง"
          href="/about-us/careers"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((cluster) => {
            const style = clusterTheme(cluster.code);
            const Icon = style.icon;
            const titles = titlesByCode[cluster.code] ?? [];
            const shown = titles.slice(0, MAX_CHIPS);
            const more = titles.length - shown.length;
            return (
              <Link
                key={cluster.code}
                href="/about-us/careers"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--navy-900)]/20 hover:shadow-[0_14px_32px_rgba(15,29,63,0.08)]"
              >
                <span className={cn("absolute inset-x-0 top-0 h-1", style.bar)} aria-hidden />
                <div className="flex items-start justify-between">
                  <span className={cn("inline-flex size-11 items-center justify-center rounded-xl", style.tone)}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="size-4 text-[var(--ink-soft)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--navy-900)]"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--ink)]">
                  {cluster.name_en || cluster.name}
                </h3>
                {cluster.name_en ? (
                  <p className="text-sm text-[var(--ink-soft)]">{cluster.name}</p>
                ) : null}
                {cluster.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {cluster.description}
                  </p>
                ) : null}
                {shown.length > 0 ? (
                  <div className="mt-auto pt-4">
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-[var(--ink-soft)]/80 uppercase">
                      ตัวอย่างอาชีพ
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {shown.map((title) => (
                        <li
                          key={title}
                          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--ink)] transition group-hover:border-[var(--navy-900)]/15 group-hover:bg-white"
                        >
                          {title}
                        </li>
                      ))}
                      {more > 0 ? (
                        <li className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", style.tone)}>
                          +{more}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
