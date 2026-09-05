export type NewsAudience = "external" | "internal";

export type NewsDto = {
  id: string;
  audience: string;
  title: string;
  body: string;
  image_url: string;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsItem = {
  id: string;
  audience: NewsAudience;
  title: string;
  body: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsListParams = {
  audience?: NewsAudience;
  isPublished?: boolean;
  publishedOnly?: boolean;
};

export type CreateNewsInput = {
  audience: NewsAudience;
  title: string;
  body?: string;
  image_url?: string;
  is_published?: boolean;
};

export type UpdateNewsInput = {
  audience?: NewsAudience;
  title?: string;
  body?: string;
  image_url?: string;
  is_published?: boolean;
};
