"use client";

import { ExternalLink, X } from "lucide-react";
import type { HomeActivity } from "./types";

/**
 * ป็อปอัพรายละเอียดกิจกรรม + ลิงก์ Google Photos
 */
export function ActivityModal({
  activity,
  onClose,
}: {
  activity: HomeActivity | null;
  onClose: () => void;
}) {
  if (!activity) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activity.title}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {activity.date ? (
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                {activity.date}
              </p>
            ) : null}
            <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">{activity.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--muted)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-[#d9d9d9]">
          {activity.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        {activity.description ? (
          <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-[var(--ink-soft)]">
            {activity.description}
          </p>
        ) : null}

        {activity.googlePhotosUrl ? (
          <a
            href={activity.googlePhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy-950)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--navy-900)]"
          >
            เปิดอัลบั้มรูป (Google Photos)
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : (
          <p className="text-center text-xs text-[var(--ink-soft)]">ยังไม่มีลิงก์ Google Photos</p>
        )}
      </div>
    </div>
  );
}
