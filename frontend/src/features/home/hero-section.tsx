"use client";

/**
 * hero-section.tsx
 * -----------------
 * Hero เต็มจอแบบเรียบ: วิดีโอเล่นเงียบอัตโนมัติ
 * ปุ่มเสียงอยู่มุมล่างซ้าย (ไม่ทับกลางจอ) — กดวิดีโอเพื่อสลับเปิด/ปิดเสียง
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeHeroMedia } from "./hooks/use-home-contents";
import type { HomeHeroMedia } from "./types";

const FALLBACK_YOUTUBE_ID = "jrbuyHuGlUQ";

function scrollToAbout() {
  document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CinematicVideo({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("canplay", tryPlay, { once: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(video);

    return () => io.disconnect();
  }, [src]);

  function setMutedState(next: boolean) {
    const video = ref.current;
    if (!video) return;
    video.muted = next;
    if (!next) void video.play().catch(() => {});
    setMuted(next);
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        title={title}
        aria-label={title}
        onClick={() => setMutedState(!muted)}
      />
      <SoundChip muted={muted} onToggle={() => setMutedState(!muted)} />
    </>
  );
}

function CinematicYoutube({ videoId, title }: { videoId: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  function command(func: string) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  }

  function toggle() {
    const next = !muted;
    command(next ? "mute" : "unMute");
    if (!next) command("playVideo");
    setMuted(next);
  }

  return (
    <>
      <iframe
        ref={iframeRef}
        className="pointer-events-none absolute inset-0 h-full w-full border-0"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <button
        type="button"
        className="absolute inset-0 z-[5] cursor-pointer bg-transparent"
        aria-label={muted ? "เปิดเสียงวิดีโอ" : "ปิดเสียงวิดีโอ"}
        onClick={toggle}
      />
      <SoundChip muted={muted} onToggle={toggle} />
    </>
  );
}

/** ชิปเล็กมุมล่าง — ไม่บังกลางวิดีโอ */
function SoundChip({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
      className={cn(
        "absolute top-20 right-3 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1.5",
        "border border-white/20 bg-black/45 text-sm text-white/95 backdrop-blur-md",
        "transition hover:bg-black/55",
        "sm:top-auto sm:right-auto sm:bottom-8 sm:left-6 sm:gap-2 sm:px-3.5 sm:py-2",
        "hero-fade-up"
      )}
      style={{ animationDelay: "0.6s" }}
    >
      {muted ? (
        <VolumeX className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
      ) : (
        <Volume2 className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
      )}
      <span className="text-xs font-medium tracking-wide sm:text-sm">
        {muted ? "เปิดเสียง" : "ปิดเสียง"}
      </span>
    </button>
  );
}

function HeroMedia({ media }: { media: HomeHeroMedia }) {
  if (media.kind === "video") {
    return <CinematicVideo src={media.src} title={media.title} />;
  }

  if (media.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={media.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return <CinematicYoutube videoId={media.videoId} title={media.title} />;
}

export function HeroSection() {
  const { data, loading } = useHomeHeroMedia();
  const media: HomeHeroMedia =
    data ??
    ({
      kind: "youtube",
      videoId: FALLBACK_YOUTUBE_ID,
      title: "วิดีโอแนะนำภาควิชาวิศวกรรมคอมพิวเตอร์",
    } satisfies HomeHeroMedia);

  return (
    <section className="relative w-full overflow-hidden bg-black sm:h-svh sm:min-h-[560px]">
      {/* มือถือ: สูงราว 3/4 จอ ตัดขอบน้อยกว่าเต็มจอ — จอใหญ่: เต็มจอ */}
      <div className="relative h-[72svh] min-h-[420px] w-full overflow-hidden bg-black sm:absolute sm:inset-0 sm:h-auto sm:min-h-0">
        {loading && !data ? (
          <div className="absolute inset-0 animate-pulse bg-neutral-900" aria-hidden />
        ) : (
          <HeroMedia media={media} />
        )}

        {/* ไล่สีเบา ๆ เฉพาะขอบ — ไม่กลบกลางคลิป */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70 sm:from-black/40 sm:to-black/50"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-4 pb-8 sm:pt-16 sm:pb-12">
          <p
            className="hero-fade-up text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 sm:text-xs"
            style={{ animationDelay: "0.2s" }}
          >
            Computer Engineering
          </p>
          <h1
            className="hero-fade-up mt-1 max-w-2xl text-center text-lg font-semibold leading-snug text-white sm:mt-1.5 sm:text-2xl md:text-3xl"
            style={{ animationDelay: "0.35s" }}
          >
            ภาควิชาวิศวกรรมคอมพิวเตอร์
          </h1>

          <button
            type="button"
            onClick={scrollToAbout}
            className="hero-fade-up pointer-events-auto mt-6 hidden flex-col items-center gap-0.5 text-white/70 transition hover:text-white sm:flex"
            style={{ animationDelay: "0.55s" }}
            aria-label="เลื่อนไป About Us"
          >
            <span className="text-xs tracking-wide">รู้จักภาควิชา</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
