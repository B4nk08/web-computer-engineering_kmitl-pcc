import type { ContentDetail } from "@/features/content";
import type { AdmissionsInfo, SupportItem } from "./types";

function str(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function stringList(extra: Record<string, unknown> | null, key: string): string[] {
  const value = extra?.[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function supportList(extra: Record<string, unknown> | null): SupportItem[] {
  const value = extra?.support_items;
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const row = item as Record<string, unknown>;
      const title = typeof row.title === "string" ? row.title.trim() : "";
      const detail = typeof row.detail === "string" ? row.detail.trim() : "";
      if (!title) return null;
      return { title, detail };
    })
    .filter((row): row is SupportItem => row !== null);
}

export function mapAdmissions(item: ContentDetail): AdmissionsInfo {
  const extra = item.extra;
  return {
    id: item.id,
    title: item.title.trim(),
    titleEn: str(extra, "title_en"),
    body: item.body.trim(),
    tuition: str(extra, "tuition"),
    quota: str(extra, "quota"),
    applyUrl: str(extra, "apply_url"),
    qualifications: stringList(extra, "qualifications"),
    supportItems: supportList(extra),
    documents: stringList(extra, "documents"),
  };
}
