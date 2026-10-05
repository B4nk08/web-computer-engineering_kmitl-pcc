"use client";

import { useAsyncData } from "@/lib/use-async-data";
import { listNews } from "../api";
import type { NewsAudience, NewsItem } from "../types";

export function usePublishedNews(audience?: NewsAudience) {
  return useAsyncData(
    () => listNews({ audience, publishedOnly: true }),
    [] as NewsItem[],
    "โหลดข่าวสารไม่สำเร็จ",
    [audience],
  );
}
