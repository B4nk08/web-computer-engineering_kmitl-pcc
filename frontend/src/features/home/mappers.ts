import type { ContentDetail } from "@/features/content";
import type { HomeHeroMedia, HomeShowcaseItem, HomeStaffMember } from "./types";

function extraString(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function mapStaffToHome(item: ContentDetail): HomeStaffMember {
  const position =
    extraString(item.extra, "position") ||
    extraString(item.extra, "role") ||
    "อาจารย์";

  return {
    id: item.id,
    name: item.title,
    position: position === "-" ? "อาจารย์" : position,
    bio: item.body,
    imageUrl: item.imageUrl,
  };
}

export function mapStudentWorkToHome(item: ContentDetail): HomeShowcaseItem {
  return {
    id: item.id,
    title: item.title,
    subtitle: extraString(item.extra, "subtitle") || extraString(item.extra, "category") || "ผลงานนักศึกษา",
    detail: item.body,
    imageUrl: item.imageUrl,
  };
}

function isVideoFileUrl(url: string): boolean {
  return (
    /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(url) ||
    url.includes("/uploads/video/")
  );
}

function isImageFileUrl(url: string): boolean {
  return (
    /\.(jpe?g|png|gif|webp)(\?|$)/i.test(url) ||
    url.includes("/uploads/image/")
  );
}

/** ดึง YouTube video id จาก URL แบบ watch / youtu.be / embed */
export function extractYoutubeId(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "v");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    }
  } catch {
    if (/^[\w-]{11}$/.test(raw)) return raw;
  }
  return null;
}

/**
 * เลือกสื่อ Hero จากรายการ video ที่เผยแพร่
 * ลำดับ: ไฟล์วิดีโอ → รูป → YouTube URL ใน extra
 */
export function mapVideoToHomeHero(item: ContentDetail | null | undefined): HomeHeroMedia | null {
  if (!item) return null;
  const title = item.title || "วิดีโอแนะนำภาควิชาวิศวกรรมคอมพิวเตอร์";
  const fileUrl = item.imageUrl?.trim() ?? "";

  if (fileUrl && isVideoFileUrl(fileUrl)) {
    return { kind: "video", src: fileUrl, title };
  }
  if (fileUrl && isImageFileUrl(fileUrl)) {
    return { kind: "image", src: fileUrl, title };
  }

  const youtubeUrl = extraString(item.extra, "youtube_url");
  const videoId = extractYoutubeId(youtubeUrl);
  if (videoId) {
    return { kind: "youtube", videoId, title };
  }

  if (fileUrl.includes("/uploads/")) {
    return { kind: "video", src: fileUrl, title };
  }

  return null;
}
