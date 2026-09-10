"use client";

import { useEffect, useState } from "react";
import { listNews } from "../api";
import type { NewsAudience, NewsItem } from "../types";

type State = {
  data: NewsItem[];
  loading: boolean;
  error: string | null;
};

export function usePublishedNews(audience?: NewsAudience): State {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listNews({ audience, publishedOnly: true })
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข่าวสารไม่สำเร็จ");
        setData([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [audience]);

  return { data, loading, error };
}
