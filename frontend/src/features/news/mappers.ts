import type { NewsDto, NewsItem } from "./types";

export function mapNewsDto(dto: NewsDto): NewsItem {
  return {
    id: dto.id,
    audience: (dto.audience === "internal" ? "internal" : "external") as NewsItem["audience"],
    title: dto.title ?? "",
    body: dto.body ?? "",
    imageUrl: dto.image_url ?? "",
    isPublished: dto.is_published,
    publishedAt: dto.published_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
