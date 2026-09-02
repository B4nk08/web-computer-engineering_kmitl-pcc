import type { ContentDto, ContentItem, ContentType } from "./types";

function readExtraString(extra: unknown, key: string): string | undefined {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return undefined;
  const value = (extra as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function subtitleFromDto(dto: ContentDto): string | undefined {
  if (dto.type === "staff") {
    return readExtraString(dto.extra, "position");
  }
  if (dto.type === "career_path") {
    return readExtraString(dto.extra, "role");
  }
  if (dto.type === "student_work") {
    return readExtraString(dto.extra, "year");
  }
  return undefined;
}

export function mapContentDto(dto: ContentDto): ContentItem {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type as ContentType,
    fileUrl: dto.file_url || undefined,
    subtitle: subtitleFromDto(dto),
    isPublished: dto.is_published,
    updatedAt: dto.updated_at,
  };
}
