import type { ContentType } from "@/config/admin-nav";

export type { ContentType };

/** Types ที่ backend `/api/contents` รองรับแล้ว */
export const API_CONTENT_TYPES = [
  "page",
  "staff",
  "student_work",
  "video",
  "career_path",
  "admissions",
  "curriculum",
] as const;

export type ApiContentType = (typeof API_CONTENT_TYPES)[number];

export function isApiContentType(type: ContentType): type is ApiContentType {
  return (API_CONTENT_TYPES as readonly string[]).includes(type);
}

/** Response จาก backend ContentResponse */
export type ContentDto = {
  id: string;
  type: string;
  slug?: string | null;
  title: string;
  body: string;
  image_url: string;
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
  slug?: string | null;
  isPublished: boolean;
  updatedAt: string;
};

/** รายละเอียดเต็มสำหรับหน้าสาธารณะ (Home / Faculty / Showcase) */
export type ContentDetail = {
  id: string;
  type: ContentType;
  slug?: string | null;
  title: string;
  body: string;
  imageUrl: string;
  extra: Record<string, unknown> | null;
  sortOrder: number;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentListParams = {
  type: ContentType;
  isPublished?: boolean;
  publishedOnly?: boolean;
  slug?: string;
};

export type CreateContentInput = {
  type: ApiContentType;
  title: string;
  slug?: string;
  body?: string;
  image_url?: string;
  extra?: unknown;
  sort_order?: number;
  is_published?: boolean;
};

export type UpdateContentInput = {
  title?: string;
  slug?: string | null;
  body?: string;
  image_url?: string;
  extra?: unknown;
  sort_order?: number;
  is_published?: boolean;
};

export type ContentManagerProps = {
  type: ContentType;
  title: string;
  description: string;
};
