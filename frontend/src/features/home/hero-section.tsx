"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/**
 * hero-section.tsx
 * -----------------
 * ส่วนหัวของหน้า Home พื้นหลังใส่ได้ทั้งวิดีโอหรือรูปภาพ
 *
 * วิธีใส่สื่อจริง:
 *  - วิดีโอ: วางไฟล์ไว้ที่ /public/videos/ แล้วแก้ VIDEO_SRC เป็น "/videos/xxx.mp4"
 *  - รูปภาพ: วางไฟล์ไว้ที่ /public/images/ แล้วแก้ IMAGE_SRC เป็น "/images/xxx.jpg"
 * ถ้ายังไม่มีไฟล์ ระบบจะแสดง gradient เทาแทนไปก่อน (placeholder)
 */

const VIDEO_SRC = ""; // เช่น "/videos/department-intro.mp4"
const IMAGE_SRC = ""; // เช่น "/images/hero.jpg"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      setPlaying((p) => !p);
      return;
    }
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative flex h-[70vh] min-h-[420px] w-full items-center justify-center overflow-hidden bg-[var(--surface-alt)] sm:h-[80vh]">
      {/* พื้นหลัง: วิดีโอ > รูปภาพ > gradient เริ่มต้น */}
      {VIDEO_SRC ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          loop
          muted
          playsInline
        />
      ) : IMAGE_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element -- ใช้ img ธรรมดาเพื่อความยืดหยุ่นตอนยังไม่มีไฟล์จริง เปลี่ยนเป็น next/image ได้เมื่อใส่รูปจริงแล้ว
        <img
          src={IMAGE_SRC}
          alt="ภาพบรรยากาศภาควิชาวิศวกรรมคอมพิวเตอร์"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#c7c7c7] to-[#a9a9a9]" />
      )}

      <div className="absolute inset-0 bg-black/10" />

      {/* ปุ่มเล่น/หยุดวิดีโอ */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "หยุดวิดีโอ" : "เล่นวิดีโอ"}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
      >
        {playing ? (
          <Pause className="h-7 w-7 fill-current sm:h-8 sm:w-8" />
        ) : (
          <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
        )}
      </button>
    </section>
  );
}
