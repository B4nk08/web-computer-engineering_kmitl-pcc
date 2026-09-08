import type { ContentDetail } from "@/features/content";
import type { ActivityItem } from "./types";

function extraString(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function mapActivity(item: ContentDetail): ActivityItem {
  return {
    id: item.id,
    title: item.title,
    date: extraString(item.extra, "event_date"),
    description: item.body,
    imageUrl: item.imageUrl,
    googlePhotosUrl: extraString(item.extra, "google_photos_url"),
  };
}
