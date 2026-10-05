import { formatThaiDate } from "@/lib/format-date";
import type { NewsAudience } from "../types";

const TITLES: Record<NewsAudience, string> = {
  external: "ประกาศรับสมัคร",
  internal: "ประกาศภายในสาขา",
};

/**
 * หัวข้อหน้า News — แบบหนังสือพิมพ์ ไม่มีแท็บซ้ำกับเมนู
 */
export function NewsPageHeader({ audience }: { audience: NewsAudience }) {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--ink)] pb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink)]">
            News
          </p>
          <time className="text-right text-xs text-[var(--ink-soft)] sm:text-sm">
            {formatThaiDate(new Date(), "weekday")}
          </time>
        </div>

        <h1 className="border-b-2 border-[var(--ink)] py-4 text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
          {TITLES[audience]}
        </h1>
      </div>
    </header>
  );
}
