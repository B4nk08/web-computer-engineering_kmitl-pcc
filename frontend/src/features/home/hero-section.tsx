"use client";

/**
 * hero-section.tsx
 * -----------------
 * Hero ของหน้า Home — วิดีโอ YouTube ขนาดพอดี กึ่งกลางหน้า
 */

const YOUTUBE_VIDEO_ID = "jrbuyHuGlUQ";
const YOUTUBE_EMBED_SRC = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`;

export function HeroSection() {
  return (
    <section className="w-full bg-[var(--surface)] px-3 py-6 md:px-5 md:py-8">
      <div className="relative mx-auto aspect-video w-full max-w-[1480px] overflow-hidden rounded-xl bg-black shadow-md">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={YOUTUBE_EMBED_SRC}
          title="วิดีโอแนะนำภาควิชาวิศวกรรมคอมพิวเตอร์"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
