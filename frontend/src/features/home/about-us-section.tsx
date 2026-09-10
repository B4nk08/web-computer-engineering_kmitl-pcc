"use client";

import Link from "next/link";
import { BookOpen, FileSearch } from "lucide-react";
import { useActivities } from "@/features/about-us";
import { useHomeCurriculum } from "./hooks/use-home-contents";
import { ScrollRow } from "./scroll-row";

/**
 * About Us ตามเลย์เอาต์ใหม่:
 * หัวข้อ → รูป + เนื้อหาเบื้องต้น (พื้นขาว) → ปุ่มหลักสูตร/คุณสมบัติ + กล่องกิจกรรม
 * ไม่โชว์ข่าวสาร (ข่าวแยก Admin เป็น external/internal)
 */
export function AboutUsSection() {
  const { data: curriculum, loading } = useHomeCurriculum();
  const { data: activities, loading: activitiesLoading } = useActivities();

  return (
    <section id="about" className="scroll-mt-24 bg-white pb-10 pt-12 sm:pb-12 sm:pt-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--ink)] sm:mb-8 sm:text-4xl">
          About Us
        </h2>

        {/* รูปซ้าย / เนื้อหาเบื้องต้นขวา — พื้นขาว ไม่มีกรอบ navy */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[var(--surface)] sm:min-h-[320px]">
            {curriculum?.aboutImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={curriculum.aboutImageUrl}
                alt={curriculum.title || "About Us"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[240px] items-center justify-center px-6 text-sm text-[var(--ink-soft)] sm:min-h-[320px]">
                {loading ? "กำลังโหลด..." : "อัปโหลดรูป About Us จาก Admin → หลักสูตร"}
              </div>
            )}
          </div>

          <div className="space-y-3 text-center sm:text-left">
            {loading ? (
              <p className="text-sm text-[var(--ink-soft)]">กำลังโหลดข้อมูลหลักสูตร...</p>
            ) : curriculum ? (
              <>
                {curriculum.title ? (
                  <p className="text-base font-semibold leading-relaxed text-[var(--ink)] sm:text-lg">
                    {curriculum.title}
                  </p>
                ) : null}
                {curriculum.titleEn ? (
                  <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{curriculum.titleEn}</p>
                ) : null}
                {curriculum.body ? (
                  <p className="whitespace-pre-line text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
                    {curriculum.body}
                  </p>
                ) : (
                  <p className="text-sm leading-8 text-[var(--ink-soft)] sm:text-[15px] sm:leading-9">
                    หลักสูตรวิศวกรรมคอมพิวเตอร์มุ่งเน้นพื้นฐานวิทยาศาสตร์ คณิตศาสตร์ และการเขียนโปรแกรม
                    พร้อมทักษะฮาร์ดแวร์ ซอฟต์แวร์ และเครือข่ายผ่านการเรียนแบบ Active Learning
                  </p>
                )}
                {curriculum.systemDescription ? (
                  <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                    {curriculum.systemDescription}
                  </p>
                ) : null}
                {curriculum.location ? (
                  <p className="text-sm text-[var(--ink-soft)]">
                    สถานที่จัดการเรียนการสอน: {curriculum.location}
                  </p>
                ) : null}
                {curriculum.language ? (
                  <p className="text-sm text-[var(--ink-soft)]">ภาษาที่ใช้: {curriculum.language}</p>
                ) : null}
                {curriculum.summary.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
                    {curriculum.summary.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-[var(--surface)] px-3 py-2 text-center"
                      >
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.value}</p>
                        <p className="text-[11px] text-[var(--ink-soft)]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่</p>
            )}
          </div>
        </div>
      </div>

      {/* ปุ่มซ้ายแบบวงไอคอน + แถบยาว / กิจกรรมขวา */}
      <div className="mx-auto mt-8 grid max-w-[1200px] gap-5 px-4 md:px-8 lg:grid-cols-[300px_1fr] lg:items-stretch lg:gap-6">
        <div className="flex flex-col justify-center gap-6">
          <Link
            href="/about-us/beng"
            className="group relative flex min-h-[88px] items-center pl-10"
          >
            <span className="absolute left-0 z-10 flex size-[88px] items-center justify-center rounded-full bg-[var(--navy-950)] shadow-md ring-4 ring-white transition group-hover:bg-[var(--navy-900)]">
              <BookOpen className="size-9 text-white" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex min-h-[72px] w-full flex-col justify-center gap-2 rounded-full bg-[var(--navy-950)] py-3 pl-14 pr-5 text-white shadow-md transition group-hover:bg-[var(--navy-900)]">
              <span className="text-sm font-semibold leading-tight sm:text-[15px]">หลักสูตร พ.ศ. 2564</span>
              <span className="inline-flex w-fit rounded-md bg-white px-3 py-1 text-xs font-semibold text-[var(--navy-950)]">
                เพิ่มเติม
              </span>
            </span>
          </Link>

          <Link
            href="/about-us/admission-requirements"
            className="group relative flex min-h-[88px] items-center pl-10"
          >
            <span className="absolute left-0 z-10 flex size-[88px] items-center justify-center rounded-full bg-[var(--navy-950)] shadow-md ring-4 ring-white transition group-hover:bg-[var(--navy-900)]">
              <FileSearch className="size-9 text-white" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex min-h-[72px] w-full flex-col justify-center gap-2 rounded-full bg-[var(--navy-950)] py-3 pl-14 pr-5 text-white shadow-md transition group-hover:bg-[var(--navy-900)]">
              <span className="text-sm font-semibold leading-tight sm:text-[15px]">
                คุณสมบัติของผู้เข้าศึกษา
              </span>
              <span className="inline-flex w-fit rounded-md bg-white px-3 py-1 text-xs font-semibold text-[var(--navy-950)]">
                เพิ่มเติม
              </span>
            </span>
          </Link>
        </div>

        <div
          id="activities"
          className="scroll-mt-24 flex min-h-[240px] min-w-0 flex-col rounded-2xl border border-black/5 bg-[var(--surface)] px-4 py-5 sm:min-h-[280px] sm:px-6 sm:py-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-wide text-[var(--ink)]">
              กิจกรรม
            </h3>
            <Link
              href="/about-us/activities"
              className="group/all text-xs font-medium text-[var(--navy-900)] underline-offset-4 transition hover:underline sm:text-sm"
            >
              ดูทั้งหมด
              <span className="inline-block transition-transform duration-200 group-hover/all:translate-x-0.5">
                {" "}
                →
              </span>
            </Link>
          </div>

          {activitiesLoading ? (
            <p className="flex flex-1 items-center justify-center text-sm text-[var(--ink-soft)]">
              กำลังโหลดกิจกรรม...
            </p>
          ) : activities.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-sm text-[var(--ink-soft)]">
              ยังไม่มีกิจกรรมที่เผยแพร่ — เพิ่มได้ที่ Admin → กิจกรรม
            </p>
          ) : (
            <ScrollRow className="sm:px-10">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="group flex w-28 shrink-0 flex-col items-center gap-2 text-center sm:w-32"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:ring-[var(--navy-900)]/30">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-[11px] text-[var(--ink-soft)]">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <span className="line-clamp-2 text-xs font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--navy-900)]">
                    {item.title}
                  </span>
                </div>
              ))}
            </ScrollRow>
          )}
        </div>
      </div>
    </section>
  );
}
