import type { ContentDetail } from "@/features/content";
import type {
  HomeHeroMedia,
  HomeStaffMember,
  StaffEducation,
  StaffEducationLevel,
} from "./types";

function extraString(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

const EDUCATION_ORDER: StaffEducationLevel[] = ["doctorate", "master", "bachelor"];

function staffEducation(extra: Record<string, unknown> | null): StaffEducation[] {
  const raw = extra?.education;
  if (!Array.isArray(raw)) return [];
  const rows: StaffEducation[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const level = e.level;
    if (level !== "bachelor" && level !== "master" && level !== "doctorate") continue;
    const degree = typeof e.degree === "string" ? e.degree.trim() : "";
    if (!degree) continue;
    rows.push({
      level,
      degree,
      institution: typeof e.institution === "string" ? e.institution.trim() : "",
      year: typeof e.year === "string" ? e.year.trim() : String(e.year ?? "").trim(),
    });
  }
  return rows.sort(
    (a, b) => EDUCATION_ORDER.indexOf(a.level) - EDUCATION_ORDER.indexOf(b.level)
  );
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
    education: staffEducation(item.extra),
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
