import { apiClient, apiFormClient, endpoints } from "@/lib/api";
import { mapContentDto } from "./mappers";
import type {
  ContentDto,
  ContentItem,
  ContentListParams,
  CreateContentInput,
  UpdateContentInput,
} from "./types";
import { isApiContentType } from "./types";

export async function listContents(
  params: ContentListParams
): Promise<ContentItem[]> {
  if (!isApiContentType(params.type)) {
    return [];
  }

  const data = await apiClient<ContentDto[]>(endpoints.contents.list, {
    method: "GET",
    query: {
      type: params.type,
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

function appendContentFormData(
  form: FormData,
  input: CreateContentInput | (UpdateContentInput & { type?: string }),
  files?: { file?: File | null; image?: File | null }
) {
  if ("type" in input && input.type) form.append("type", input.type);
  if (input.title !== undefined) form.append("title", input.title);
  if (input.body !== undefined) form.append("body", input.body);
  if (input.file_url !== undefined) form.append("file_url", input.file_url);
  if (input.sort_order !== undefined) {
    form.append("sort_order", String(input.sort_order));
  }
  if (input.is_published !== undefined) {
    form.append("is_published", String(input.is_published));
  }
  if (input.extra !== undefined) {
    form.append("extra", JSON.stringify(input.extra));
  }
  if (files?.file) form.append("file", files.file);
  if (files?.image) form.append("image", files.image);
}

/** สร้าง content — ถ้ามีไฟล์ใช้ multipart (อัป S3 + เซฟ DB ใน request เดียว) */
export async function createContent(
  input: CreateContentInput,
  files?: { file?: File | null; image?: File | null }
): Promise<ContentItem> {
  const hasFiles = Boolean(files?.file || files?.image);
  if (hasFiles) {
    const form = new FormData();
    appendContentFormData(form, input, files);
    const data = await apiFormClient<ContentDto>(endpoints.contents.list, {
      method: "POST",
      formData: form,
    });
    return mapContentDto(data);
  }

  const data = await apiClient<ContentDto>(endpoints.contents.list, {
    method: "POST",
    body: input,
  });
  return mapContentDto(data);
}

export async function updateContent(
  id: string,
  input: UpdateContentInput,
  files?: { file?: File | null; image?: File | null }
): Promise<ContentItem> {
  const hasFiles = Boolean(files?.file || files?.image);
  if (hasFiles) {
    const form = new FormData();
    appendContentFormData(form, input, files);
    const data = await apiFormClient<ContentDto>(endpoints.contents.byId(id), {
      method: "PUT",
      formData: form,
    });
    return mapContentDto(data);
  }

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
