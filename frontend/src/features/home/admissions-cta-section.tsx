import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardCheck, FileText, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS: { label: string; hint: string; href: string; icon: LucideIcon; tone: string }[] = [
  {
    label: "คุณสมบัติผู้สมัคร",
    hint: "รอบที่เปิดรับ จำนวนรับ และเอกสารที่ต้องใช้",
    href: "/about-us/admission-requirements",
    icon: FileText,
    tone: "bg-[#2f5fd6]/10 text-[#2f5fd6] group-hover:bg-[#2f5fd6] group-hover:text-white",
  },
  {
    label: "แบบทดสอบความพร้อม",
    hint: "ใช้เวลาไม่กี่นาที รู้ว่าเหมาะกับสาขานี้แค่ไหน",
    href: "/academics/quiz",
    icon: ClipboardCheck,
    tone: "bg-[#e07a3d]/12 text-[#c45f28] group-hover:bg-[#e07a3d] group-hover:text-white",
  },
  {
    label: "ประกาศรับสมัคร",
    hint: "วันเปิด-ปิดรับสมัคร และลิงก์สมัครล่าสุด",
    href: "/news",
    icon: Megaphone,
    tone: "bg-[#0d9488]/10 text-[#0d9488] group-hover:bg-[#0d9488] group-hover:text-white",
  },
];

/** แถบชวนสมัคร — ทางเข้าหลักสำหรับผู้สนใจเข้าศึกษา */
export function AdmissionsCtaSection() {
  return (
    <section className="bg-white px-4 py-12 sm:py-16 md:px-8">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--navy-950)] via-[var(--navy-900)] to-[#1f3b8a] px-6 py-10 text-white shadow-[0_24px_60px_rgba(15,29,63,0.25)] sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-[#2f5fd6]/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-[#e07a3d]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/15">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#e07a3d] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#e07a3d]" />
              </span>
              Join Computer Engineering
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              สนใจเรียน
              <br />
              วิศวกรรมคอมพิวเตอร์?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
              เริ่มจากดูคุณสมบัติ ลองทำแบบทดสอบความพร้อม แล้วติดตามประกาศรับสมัครรอบล่าสุด
            </p>
            <Link
              href="/academics/quiz"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#e07a3d] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(224,122,61,0.35)] transition hover:-translate-y-0.5 hover:bg-[#d06a2d] hover:shadow-[0_14px_30px_rgba(224,122,61,0.45)]"
            >
              เริ่มทำแบบทดสอบ
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {ACTIONS.map(({ label, hint, href, icon: Icon, tone }, index) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-2xl bg-white p-5 text-[var(--ink)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "inline-flex size-12 items-center justify-center rounded-xl transition duration-300",
                      tone,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold tracking-wider text-[var(--ink-soft)]/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-5 text-[15px] font-semibold leading-snug">{label}</span>
                <span className="mt-1.5 text-xs leading-relaxed text-[var(--ink-soft)]">{hint}</span>
                <span className="mt-auto flex items-center justify-between pt-5 text-xs font-semibold text-[var(--navy-900)]">
                  ไปที่หน้านี้
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--surface)] transition duration-300 group-hover:bg-[var(--navy-900)] group-hover:text-white">
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
