import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** กล่องข้อมูลเต็มความกว้างหัวข้อ — ชิดซ้ายเท่าเดิม ขยายไปทางขวา */
export function AboutUsDoc({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export function AboutUsDocTitle({
  title,
  titleEn,
  action,
}: {
  title: string;
  titleEn?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--navy-900)] sm:text-xl">
          {title}
        </h2>
        {titleEn ? (
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-soft)] sm:text-sm">
            {titleEn}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap justify-end gap-2">{action}</div> : null}
    </header>
  );
}

export function AboutUsDocMeta({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-[var(--ink-soft)] sm:text-xs">
      <span className="mt-0.5 shrink-0 text-[var(--navy-900)]/45">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

export function AboutUsStatBar({
  items,
  className,
}: {
  items: { value: string; label: string }[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex divide-x divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white",
        className ?? "mt-5",
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex-1 px-3 py-3 text-center sm:px-4">
          <p className="text-base font-semibold tracking-tight text-[var(--navy-900)] sm:text-lg">
            {item.value}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--ink-soft)] sm:text-xs">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function AboutUsFieldList({
  heading,
  rows,
  empty,
}: {
  heading?: string;
  rows: { label: string; value: ReactNode }[];
  empty?: string;
}) {
  if (rows.length === 0 && !empty) return null;

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      {heading ? (
        <h3 className="px-4 py-3 text-sm font-semibold text-[var(--ink)] sm:px-5">
          {heading}
        </h3>
      ) : null}
      {rows.length === 0 ? (
        <p
          className={cn(
            "px-4 py-4 text-sm text-[var(--ink-soft)] sm:px-5",
            heading && "border-t border-[var(--border)]",
          )}
        >
          {empty}
        </p>
      ) : (
        <dl
          className={cn(
            "divide-y divide-[var(--border)] text-sm",
            heading && "border-t border-[var(--border)]",
          )}
        >
          {rows.map((row, i) => (
            <div key={`${row.label}-${i}`} className="px-4 py-4 sm:px-5">
              <dt className="text-xs text-[var(--ink-soft)]">{row.label}</dt>
              <dd className="mt-0.5 font-medium leading-relaxed text-[var(--ink)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
