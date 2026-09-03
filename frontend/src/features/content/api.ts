import { apiClient, endpoints } from "@/lib/api";
import { mapContentDto } from "./mappers";
import type {
  ContentDto,
  ContentItem,
  ContentListParams,
  CreateContentInput,
  UpdateContentInput,
} from "./types";
import { isApiContentType } from "./types";

export async function listContents(params: ContentListParams): Promise<ContentItem[]> {
  if (!isApiContentType(params.type)) {
    return [];
  }

  const data = await apiClient<ContentDto[]>(endpoints.contents.list, {
    method: "GET",
    query: {
      type: params.type,
      slug: params.slug,
      is_published: params.isPublished,
      published_only: params.publishedOnly,
    },
  });

  return (data ?? []).map(mapContentDto);
}

export async function getContentDetail(id: string): Promise<ContentDto> {
  return apiClient<ContentDto>(endpoints.contents.byId(id), {
    method: "GET",
  });
}

export async function getContent(id: string): Promise<ContentItem> {
  const data = await getContentDetail(id);
  return mapContentDto(data);
}

export async function createContent(input: CreateContentInput): Promise<ContentItem> {
  const data = await apiClient<ContentDto>(endpoints.contents.list, {
    method: "POST",
    body: input,
  });
  return mapContentDto(data);
}

export async function updateContent(
  id: string,
  input: UpdateContentInput
): Promise<ContentItem> {
  const data = await apiClient<ContentDto>(endpoints.contents.byId(id), {
    method: "PUT",
    body: input,
  });
  return mapContentDto(data);
}

export async function deleteContent(id: string): Promise<void> {
  await apiClient<{ deleted: boolean }>(endpoints.contents.byId(id), {
    method: "DELETE",
  });
}
