import type { ContentDetail, ContentDto, ContentItem, ContentType } from "./types";

function asExtraRecord(extra: unknown): Record<string, unknown> | null {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return null;
  return extra as Record<string, unknown>;
}

export function mapContentDto(dto: ContentDto): ContentItem {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type as ContentType,
    slug: dto.slug,
    isPublished: dto.is_published,
    updatedAt: dto.updated_at,
  };
}

/** map สำหรับหน้าสาธารณะ — คง body / image / extra ครบ */
export function mapContentDetail(dto: ContentDto): ContentDetail {
  return {
    id: dto.id,
    type: dto.type as ContentType,
    slug: dto.slug,
    title: dto.title,
    body: dto.body ?? "",
    imageUrl: dto.image_url ?? "",
    extra: asExtraRecord(dto.extra),
    sortOrder: dto.sort_order ?? 0,
    isPublished: dto.is_published,
    publishedAt: dto.published_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
