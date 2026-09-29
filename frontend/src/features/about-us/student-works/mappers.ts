import type { ContentDetail } from "@/features/content";
import {
  normalizeStudentWorkCategory,
  type StudentWork,
} from "./types";

function extraString(
  extra: Record<string, unknown> | null,
  key: string,
): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function extraUrlList(
  extra: Record<string, unknown> | null,
  key: string,
): string[] {
  const value = extra?.[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function mapStudentWork(item: ContentDetail): StudentWork {
  const rawCategory =
    extraString(item.extra, "subtitle") ||
    extraString(item.extra, "category") ||
    "Other";

  return {
    id: item.id,
    title: item.title,
    subtitle: normalizeStudentWorkCategory(rawCategory),
    detail: item.body,
    imageUrl: item.imageUrl,
    galleryUrls: extraUrlList(item.extra, "gallery_urls"),
    year: extraString(item.extra, "year"),
    projectUrl:
      extraString(item.extra, "project_url") ||
      extraString(item.extra, "demo_url") ||
      extraString(item.extra, "url"),
    manual:
      extraString(item.extra, "manual") ||
      extraString(item.extra, "user_manual"),
    manualUrl:
      extraString(item.extra, "manual_url") ||
      extraString(item.extra, "user_manual_url"),
  };
}
