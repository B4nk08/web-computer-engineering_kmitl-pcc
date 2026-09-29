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
    clusterCode: extraString(item.extra, "cluster_code"),
    salaryJunior:
      extraString(item.extra, "salary_junior") ||
      extraString(item.extra, "salary_entry"),
    salaryMid:
      extraString(item.extra, "salary_mid") ||
      extraString(item.extra, "salary_middle"),
    salarySenior: extraString(item.extra, "salary_senior"),
    salary:
      extraString(item.extra, "salary") ||
      extraString(item.extra, "salary_range"),
    skills: extraString(item.extra, "skills"),
    outlook:
      extraString(item.extra, "outlook") ||
      extraString(item.extra, "growth"),
  };
}
