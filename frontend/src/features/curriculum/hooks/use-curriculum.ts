"use client";

import { useEffect, useState } from "react";
import { fetchCurriculum } from "../api";
import type { CurriculumProgram } from "../types";

type State = {
  data: CurriculumProgram | null;
  loading: boolean;
  error: string | null;
};

export function useCurriculum(): State {
  const [data, setData] = useState<CurriculumProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchCurriculum()
      .then((row) => {
        if (!alive) return;
        setData(row);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลหลักสูตรไม่สำเร็จ");
        setData(null);
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
