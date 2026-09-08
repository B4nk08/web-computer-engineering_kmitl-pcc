"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import type { ActivityItem } from "../types";

/**
 * ป็อปอัพกิจกรรม — ล็อกพื้นหลังโดยไม่ขยับ scroll จริง
 */
export function ActivityModal({
  activity,
  onClose,
}: {
  activity: ActivityItem | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!activity) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    const isInPanel = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return false;
      return Boolean(panelRef.current?.contains(target));
    };

    const blockScroll = (e: Event) => {
      if (isInPanel(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("wheel", blockScroll, { passive: false });
    document.addEventListener("touchmove", blockScroll, { passive: false });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("wheel", blockScroll);
      document.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", onKeyDown, true);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
    };
  }, [activity?.id]);

  if (!activity || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={panelRef}
        className="my-auto max-h-[min(90svh,900px)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 shadow-2xl sm:p-8 md:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {activity.date ? (
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                {activity.date}
              </p>
            ) : null}
            <h3 id={titleId} className="mt-1 text-xl font-semibold text-[var(--ink)] sm:text-2xl">
              {activity.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCloseRef.current();
            }}
            aria-label="ปิด"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#d9d9d9] sm:aspect-video">
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
          <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
            {activity.description}
          </p>
        ) : null}

        {activity.googlePhotosUrl ? (
          <a
            href={activity.googlePhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy-950)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--navy-900)]"
          >
            เปิดอัลบั้มรูป (Google Photos)
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : (
          <p className="text-center text-sm text-[var(--ink-soft)]">ยังไม่มีลิงก์ Google Photos</p>
        )}
      </div>
    </div>,
    document.body
  );
}
