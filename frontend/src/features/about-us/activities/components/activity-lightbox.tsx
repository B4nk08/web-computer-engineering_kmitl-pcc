"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";

export function ActivityLightbox({
  photos,
  index,
  title,
  albumHref,
  onClose,
  onIndexChange,
}: {
  photos: string[];
  index: number;
  title: string;
  albumHref?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const onIndexChangeRef = useRef(onIndexChange);
  onCloseRef.current = onClose;
  onIndexChangeRef.current = onIndexChange;

  const current = photos[index];
  const count = photos.length;
  const hasMany = count > 1;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (count <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndexChangeRef.current((index - 1 + count) % count);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndexChangeRef.current((index + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [index, count]);

  if (!current || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 sm:p-8"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="relative flex w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p id={titleId} className="sr-only">
          {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="absolute -top-2 right-0 flex size-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>

        <div className="flex w-full items-center gap-2 sm:gap-4">
          {hasMany ? (
            <button
              type="button"
              aria-label="รูปก่อนหน้า"
              onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : null}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={`${title} ${index + 1}`}
            className="max-h-[min(78svh,820px)] w-full rounded-lg object-contain"
          />

          {hasMany ? (
            <button
              type="button"
              aria-label="รูปถัดไป"
              onClick={() => onIndexChange((index + 1) % photos.length)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="size-6" />
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-sm text-white/70">
          {index + 1} / {photos.length}
        </p>
        {albumHref ? (
          <a
            href={albumHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-white underline-offset-4 hover:underline"
          >
            เปิดอัลบั้ม Google Photos
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
