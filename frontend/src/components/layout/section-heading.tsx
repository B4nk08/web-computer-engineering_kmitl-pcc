import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  href: string;
  eyebrow?: string;
  linkLabel?: string;
  /** pill = ปุ่มแคปซูล, text = ลิงก์ข้อความ */
  action?: "pill" | "text";
};

/** หัวข้อส่วนพร้อมลิงก์ "ดูทั้งหมด" ใช้ร่วมบนหน้าแรก */
export function SectionHeading({
  title,
  href,
  eyebrow,
  linkLabel = "ดูทั้งหมด",
  action = "text",
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--navy-900)]/70 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {action === "pill" ? (
        <Link
          href={href}
          className="group/all inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--navy-900)]/15 bg-white px-4 py-2 text-sm font-medium text-[var(--navy-900)] transition hover:bg-[var(--navy-900)] hover:text-white"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover/all:translate-x-0.5" aria-hidden />
        </Link>
      ) : (
        <Link
          href={href}
          className="group/all shrink-0 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {linkLabel}
          <span className="inline-block transition-transform duration-200 group-hover/all:translate-x-0.5">
            {" "}
            →
          </span>
        </Link>
      )}
    </div>
  );
}
