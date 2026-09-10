"use client";

import { useEffect, useState } from "react";
import { fetchCareers } from "../api";
import type { CareerPath } from "../types";

type State = {
  data: CareerPath[];
  loading: boolean;
  error: string | null;
};

export function useCareers(): State {
  const [data, setData] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchCareers()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดเส้นทางอาชีพไม่สำเร็จ");
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
