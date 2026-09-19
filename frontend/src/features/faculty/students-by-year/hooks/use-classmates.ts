"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/features/auth";
import { fetchClassmates } from "../api";
import type { Classmate, ClassmatesError } from "../types";

type State = {
  data: Classmate[];
  loading: boolean;
  error: ClassmatesError | null;
};

export function useClassmates(): State {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState<Classmate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassmatesError | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    fetchClassmates()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch((err) => {
        if (!alive) return;
        setData([]);
        if (err instanceof ApiError && err.status === 403) {
          setError("forbidden");
        } else if (err instanceof ApiError && err.status === 422) {
          setError("missing_code");
        } else {
          setError("load");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [authLoading, isAuthenticated]);

  return { data, loading: authLoading || loading, error };
}
