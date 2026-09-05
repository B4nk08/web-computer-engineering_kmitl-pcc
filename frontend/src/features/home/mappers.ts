import type { ContentDetail } from "@/features/content";
import type { HomeShowcaseItem, HomeStaffMember } from "./types";

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
