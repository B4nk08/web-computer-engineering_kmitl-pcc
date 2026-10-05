"use client";

import { useEffect, useState, type DependencyList } from "react";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

/**
 * โหลดข้อมูลครั้งเดียวตอน mount (หรือเมื่อ deps เปลี่ยน)
 * ถ้าออกจากหน้าก่อนโหลดเสร็จ จะไม่ setState ต่อ
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  initial: T,
  errorMessage: string,
  deps: DependencyList = [],
): AsyncState<T> {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    loader()
      .then((value) => {
        if (alive) setData(value);
      })
      .catch(() => {
        if (!alive) return;
        setError(errorMessage);
        setData(initial);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
    // loader/initial ถูกสร้างใหม่ทุก render — ให้ deps เป็นตัวกำหนดจังหวะโหลด
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
