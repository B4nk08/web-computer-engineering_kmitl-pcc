"use client";

import { useEffect, useState } from "react";
import { fetchActivities } from "../api";
import type { ActivityItem } from "../types";

type State = {
  data: ActivityItem[];
  loading: boolean;
  error: string | null;
};

export function useActivities(): State {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchActivities()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดกิจกรรมไม่สำเร็จ");
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
