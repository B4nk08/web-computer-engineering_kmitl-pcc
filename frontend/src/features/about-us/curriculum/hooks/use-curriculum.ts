"use client";

import { useEffect, useState } from "react";
import { fetchCurricula } from "../api";
import type { CurriculumProgram } from "../types";

type ListState = {
  data: CurriculumProgram[];
  loading: boolean;
  error: string | null;
};

export function useCurricula(): ListState {
  const [data, setData] = useState<CurriculumProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchCurricula()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลหลักสูตรไม่สำเร็จ");
        setData([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

/** คงไว้ให้หน้าแรก / โค้ดเดิม — ใช้รายการแรกจาก listing */
export function useCurriculum() {
  const { data, loading, error } = useCurricula();
  return {
    data: data[0] ?? null,
    loading,
    error,
  };
}
