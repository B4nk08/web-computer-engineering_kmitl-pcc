"use client";

import { useEffect, useState } from "react";
import { fetchStudentWorks } from "../api";
import type { StudentWork } from "../types";

type State = {
  data: StudentWork[];
  loading: boolean;
  error: string | null;
};

export function useStudentWorks(): State {
  const [data, setData] = useState<StudentWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchStudentWorks()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดผลงานไม่สำเร็จ");
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
