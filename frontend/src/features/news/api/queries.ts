import { apiClient, endpoints } from "@/lib/api";
import { mapNewsDto } from "../mappers";
import type {
  CreateNewsInput,
  NewsDto,
  NewsItem,
  NewsListParams,
  UpdateNewsInput,
} from "../types";

export async function listNews(params: NewsListParams = {}): Promise<NewsItem[]> {
  const data = await apiClient<NewsDto[]>(endpoints.news.list, {
    method: "GET",
    query: {
      audience: params.audience,
      is_published: params.isPublished,
      published_only: params.publishedOnly,
    },
  });
  return (data ?? []).map(mapNewsDto);
}

export async function listPublishedExternalNews(): Promise<NewsItem[]> {
  return listNews({ audience: "external", publishedOnly: true });
}

export async function getNews(id: string): Promise<NewsItem> {
  const data = await apiClient<NewsDto>(endpoints.news.byId(id), { method: "GET" });
  return mapNewsDto(data);
}

export async function createNews(input: CreateNewsInput): Promise<NewsItem> {
  const data = await apiClient<NewsDto>(endpoints.news.list, {
    method: "POST",
    body: input,
  });
  return mapNewsDto(data);
}

export async function updateNews(id: string, input: UpdateNewsInput): Promise<NewsItem> {
  const data = await apiClient<NewsDto>(endpoints.news.byId(id), {
    method: "PUT",
    body: input,
  });
  return mapNewsDto(data);
}

export async function deleteNews(id: string): Promise<void> {
  await apiClient<{ deleted: boolean }>(endpoints.news.byId(id), {
    method: "DELETE",
  });
}
