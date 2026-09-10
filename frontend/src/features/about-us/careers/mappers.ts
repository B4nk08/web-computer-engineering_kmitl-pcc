import type { ContentDetail } from "@/features/content";
import type { CareerPath } from "./types";

function extraString(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function mapCareerPath(item: ContentDetail): CareerPath {
  return {
    id: item.id,
    title: item.title,
    role: extraString(item.extra, "role") || extraString(item.extra, "position"),
    detail: item.body,
    imageUrl: item.imageUrl,
  };
}
