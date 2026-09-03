import type { ContentDto, ContentItem, ContentType } from "./types";

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
