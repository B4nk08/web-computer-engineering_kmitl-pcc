"use client";

import { useEffect, useState } from "react";
import { fetchAdmissionsList } from "../api";
import type { AdmissionsInfo } from "../types";

type ListState = {
  data: AdmissionsInfo[];
  loading: boolean;
  error: string | null;
};

export function useAdmissionsList(): ListState {
  const [data, setData] = useState<AdmissionsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchAdmissionsList()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลรับสมัครไม่สำเร็จ");
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

export function useAdmissions() {
  const { data, loading, error } = useAdmissionsList();
  return {
    data: data[0] ?? null,
    loading,
    error,
  };
}
