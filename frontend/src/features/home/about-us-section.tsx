"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityModal } from "./activity-modal";
import { activities, type Activity } from "./data/activities";

/**
 * about-us-section.tsx
 * ---------------------
 * ส่วน "About Us" บนหน้า Home (เลื่อนหน้าลงมาจะเจอส่วนนี้) ประกอบด้วย:
 *  1) ข้อความแนะนำภาควิชา + รูปภาพที่มีจุด "ปักหมุด" กดดูข้อมูลเพิ่มเติมได้
 *  2) ปุ่ม "หลักสูตร" -> ไปหน้า B.Eng (/beng)
 *     ปุ่ม "คุณสมบัติผู้สมัคร" -> ไปหน้า Admission Requirements (/admission-requirements)
 *  3) แกลเลอรี "กิจกรรม" กดรูปไหนจะเปิดป็อปอัพอ่านรายละเอียดเพิ่มเติมได้ (ActivityModal)
 */
export function AboutUsSection() {
  const [pinOpen, setPinOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

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
          {/* รูปภาพพร้อมจุดปักหมุดข้อมูลเพิ่มเติม */}
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

          {/* เนื้อหาแนะนำหลักสูตร */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
              หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์
              มีการจัดการเรียนการสอนเป็นไปตามมาตรฐานทั้งในระดับพื้นฐานและระดับสูง
            </p>
            <p className="mb-3 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
              ชั้นปีที่ 1 เน้นพื้นฐานคณิตศาสตร์และวิทยาศาสตร์ควบคู่กับพื้นฐานวิศวกรรมคอมพิวเตอร์
              ชั้นปีที่ 2 เริ่มแบ่งสายวิชาหลัก 3 สาขา ได้แก่ ฮาร์ดแวร์ ซอฟต์แวร์
              และเครือข่ายคอมพิวเตอร์ โดยมีอาจารย์ที่ปรึกษาประจำดูแลนักศึกษารายบุคคล
            </p>
            <p className="mb-6 text-sm leading-loose text-[var(--ink-soft)] sm:text-[15px]">
              ชั้นปีที่ 3 และ 4 เน้นการฝึกปฏิบัติจริงผ่านโครงงานและการฝึกงาน
              เสริมทักษะการทำงานร่วมกันเป็นทีม การคิดวิเคราะห์ และการแก้ปัญหาอย่างเป็นระบบ
              ผ่านการเรียนรู้เชิงรุก (Active Learning)
            </p>

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

        {/* กิจกรรม */}
        <div id="activities" className="mt-16 scroll-mt-20">
          <h3 className="mb-6 text-xl font-semibold text-[var(--ink)]">กิจกรรม</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {activities.map((activity) => (
              <button
                key={activity.id}
                type="button"
                onClick={() => setActiveActivity(activity)}
                className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-[#eceef1] p-3 text-center transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#d9d9d9] text-[11px] text-[var(--ink-soft)] transition-colors group-hover:bg-[#c9cbd0]">
                  {activity.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ActivityModal activity={activeActivity} onClose={() => setActiveActivity(null)} />
    </section>
  );
}
