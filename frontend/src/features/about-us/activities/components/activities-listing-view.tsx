"use client";

import { useCallback, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useActivities } from "../hooks/use-activities";
import { ActivityModal } from "./activity-modal";
import type { ActivityItem } from "../types";

/**
 * หน้า /about-us/activities — listing การ์ดกิจกรรมทั้งหมด
 */
export function ActivitiesListingView() {
  const { data, loading, error } = useActivities();
  const [active, setActive] = useState<ActivityItem | null>(null);
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <header className="border-b border-black/5 bg-white pt-20 sm:pt-24">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 sm:pb-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy-900)]/70">
            ACTIVITIES
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            กิจกรรม
          </h1>
          <div className="mt-3 h-1 w-12 rounded-full bg-[var(--navy-900)]" />
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
            รวมกิจกรรมของภาควิชา — กดการ์ดเพื่อดูรายละเอียดและอัลบั้มรูป
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลดกิจกรรม...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีกิจกรรมที่เผยแพร่ — เพิ่มได้ที่ Admin → กิจกรรม
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {data.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                className="group flex flex-col text-left"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:ring-[var(--navy-900)]/30">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-[var(--ink-soft)]">
                      {item.title}
                    </div>
                  )}
                </div>
                {item.date ? (
                  <p className="mt-2 text-[11px] text-[var(--ink-soft)]">{item.date}</p>
                ) : null}
                <span className="mt-0.5 line-clamp-2 text-sm font-medium text-[var(--ink)]">
                  {item.title}
                </span>
                {item.googlePhotosUrl ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[var(--navy-900)]">
                    <ExternalLink className="size-3" aria-hidden />
                    มีอัลบั้มรูป
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>

      <ActivityModal activity={active} onClose={closeModal} />
    </div>
  );
}
