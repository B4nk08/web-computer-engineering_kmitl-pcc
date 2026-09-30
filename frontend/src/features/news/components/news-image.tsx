"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

/** รูปข่าวแบบเต็ม ไม่ครอป — กดเพื่อขยายเต็มจอ */
export function NewsImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mt-8 block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[var(--surface)] ring-1 ring-black/5"
        aria-label="ขยายรูปภาพ"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto h-auto max-h-[85svh] w-auto max-w-full" />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-3.5" aria-hidden />
          ดูรูปขนาดเต็ม
        </span>
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
              onClick={() => setOpen(false)}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="ปิด"
              >
                <X className="size-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
