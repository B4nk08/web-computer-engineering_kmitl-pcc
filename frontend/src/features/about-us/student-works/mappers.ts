import type { ContentDetail } from "@/features/content";
import type { StudentWork } from "./types";

function extraString(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function mapStudentWork(item: ContentDetail): StudentWork {
  return {
    id: item.id,
    title: item.title,
    subtitle:
      extraString(item.extra, "subtitle") ||
      extraString(item.extra, "category") ||
      "โครงงานปี 4",
    detail: item.body,
    imageUrl: item.imageUrl,
    year: extraString(item.extra, "year"),
    projectUrl:
      extraString(item.extra, "project_url") ||
      extraString(item.extra, "demo_url") ||
      extraString(item.extra, "url"),
  };
}
