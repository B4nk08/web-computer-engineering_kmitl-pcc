"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPublishedExternalNews, type NewsItem } from "@/features/news";
import { useHomeCurriculum } from "./hooks/use-home-contents";

/**
 * about-us-section.tsx
 * ---------------------
 * ส่วน "About Us" + ช่องการ์ดด้านล่างแสดงข่าวสารจาก API (external)
 */
export function AboutUsSection() {
  const [pinOpen, setPinOpen] = useState(false);
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const { data: curriculum, loading } = useHomeCurriculum();

  useEffect(() => {
    let alive = true;
    listPublishedExternalNews()
      .then((rows) => {
        if (alive) setNews(rows);
      })
      .catch(() => {
        if (alive) setNews([]);
      })
      .finally(() => {
        if (alive) setNewsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="about" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
          About Us
        </p>
        <h2 className="mb-8 text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          รู้จักภาควิชาวิศวกรรมคอมพิวเตอร์
        </h2>

        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-14">
          <div className="relative">
            <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#d9d9d9] text-sm text-[var(--ink-soft)]">
              รูปกิจกรรม/นักศึกษาภาควิชา
            </div>
            <button
              type="button"
              onClick={() => setPinOpen((v) => !v)}
              aria-label="ดูข้อมูลเพิ่มเติมเกี่ยวกับภาพ"
              className="absolute left-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
            >
              <Plus className="h-4 w-4" />
            </button>
            {pinOpen && (
              <div className="absolute left-5 top-16 w-56 rounded-lg bg-white p-3 text-xs leading-relaxed text-[var(--ink-soft)] shadow-xl ring-1 ring-black/5">
                นักศึกษาและอาจารย์ภาควิชาวิศวกรรมคอมพิวเตอร์ร่วมกิจกรรมเชื่อมความสัมพันธ์ระหว่างรุ่น
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {loading ? (
              <p className="mb-6 text-sm text-[var(--ink-soft)]">กำลังโหลดข้อมูลหลักสูตร...</p>
            ) : curriculum ? (
              <>
                <p className="mb-3 text-sm font-medium leading-loose text-[var(--ink)] sm:text-[15px]">
                  {curriculum.title}
                </p>
                {curriculum.titleEn ? (
                  <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                    {curriculum.titleEn}
                  </p>
                ) : null}
                {curriculum.body ? (
                  <p className="mb-3 whitespace-pre-line text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                    {curriculum.body}
                  </p>
                ) : null}
                {curriculum.systemDescription ? (
                  <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                    {curriculum.systemDescription}
                  </p>
                ) : null}
                {curriculum.location ? (
                  <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                    สถานที่จัดการเรียนการสอน: {curriculum.location}
                  </p>
                ) : null}
                {curriculum.language ? (
                  <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                    ภาษาที่ใช้: {curriculum.language}
                  </p>
                ) : null}
                {curriculum.summary.length > 0 ? (
                  <div className="mb-6 flex flex-wrap gap-3">
                    {curriculum.summary.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-[var(--surface)] px-4 py-2 text-center"
                      >
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.value}</p>
                        <p className="text-[11px] text-[var(--ink-soft)]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6" />
                )}
              </>
            ) : (
              <p className="mb-6 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
                ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/beng" className="flex items-center gap-2">
                  หลักสูตร
                  <span className="text-xs">เพิ่มเติม</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admission-requirements" className="flex items-center gap-2">
                  คุณสมบัติผู้สมัคร
                  <span className="text-xs">เพิ่มเติม</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ช่องเดิมชื่อกิจกรรม → แสดงข่าวสาร external จาก API */}
        <div id="activities" className="mt-16 scroll-mt-20">
          <h3 className="mb-6 text-xl font-semibold text-[var(--ink)]">ข่าวสาร</h3>
          {newsLoading ? (
            <p className="text-sm text-[var(--ink-soft)]">กำลังโหลดข่าวสาร...</p>
          ) : news.length === 0 ? (
            <p className="text-sm text-[var(--ink-soft)]">ยังไม่มีข่าวสารที่เผยแพร่</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {news.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNews(item)}
                  className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-[#eceef1] p-3 text-center transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#d9d9d9] text-[11px] text-[var(--ink-soft)] transition-colors group-hover:bg-[#c9cbd0]">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                    <span
                      className={
                        item.imageUrl
                          ? "relative z-10 line-clamp-3 bg-black/45 px-2 py-1 text-white"
                          : "line-clamp-3 px-1"
                      }
                    >
                      {item.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeNews ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActiveNews(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeNews.title}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-[var(--ink)]">{activeNews.title}</h3>
              <button
                type="button"
                onClick={() => setActiveNews(null)}
                aria-label="ปิด"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-[#d9d9d9]">
              {activeNews.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeNews.imageUrl}
                  alt={activeNews.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            {activeNews.body ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ink-soft)]">
                {activeNews.body}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
