import type { ContentType } from "@/config/admin-nav";

export type { ContentType };

/** Types ที่ backend `/api/contents` รองรับแล้ว */
export const API_CONTENT_TYPES = [
  "about_us",
  "curriculum",
  "staff",
  "student_work",
  "career_path",
  "admissions",
] as const;

export type ApiContentType = (typeof API_CONTENT_TYPES)[number];

export function isApiContentType(type: ContentType): type is ApiContentType {
  return (API_CONTENT_TYPES as readonly string[]).includes(type);
}

/** Response จาก backend ContentResponse */
export type ContentDto = {
  id: string;
  type: string;
  title: string;
  body: string;
  file_url: string;
  file_name?: string;
  extra?: unknown;
  sort_order: number;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

/** แถวใน Admin list UI */
export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  fileUrl?: string;
  /** เช่น ตำแหน่งบุคลากร จาก extra */
  subtitle?: string;
  isPublished: boolean;
  updatedAt: string;
};

export type ContentListParams = {
  type: ContentType;
  isPublished?: boolean;
  publishedOnly?: boolean;
};

export type CreateContentInput = {
  type: ApiContentType;
  title: string;
  body?: string;
  file_url?: string;
  extra?: unknown;
  sort_order?: number;
  is_published?: boolean;
};

export type UpdateContentInput = {
  title?: string;
  body?: string;
  file_url?: string;
  extra?: unknown;
  sort_order?: number;
  is_published?: boolean;
};

export type ContentManagerProps = {
  type: ContentType;
  title: string;
  description: string;
};
