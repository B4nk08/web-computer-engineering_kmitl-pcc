"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * แถวเลื่อนแนวนอนแบบ Student Showcase — การ์ดเรียงไปทางขวา ไม่ขึ้นแถวใหม่
 */
export function ScrollRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="เลื่อนไปทางซ้าย"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-md ring-1 ring-black/5 hover:bg-[var(--muted)] sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div
        ref={ref}
        className={`no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 ${className}`}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="เลื่อนไปทางขวา"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-md ring-1 ring-black/5 hover:bg-[var(--muted)] sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
