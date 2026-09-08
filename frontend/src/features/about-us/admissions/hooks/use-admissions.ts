"use client";

import { useEffect, useState } from "react";
import { fetchAdmissions } from "../api";
import { DEFAULT_ADMISSIONS } from "../defaults";
import type { AdmissionsInfo } from "../types";

type State = {
  data: AdmissionsInfo;
  loading: boolean;
  error: string | null;
  fromDb: boolean;
};

export function useAdmissions(): State {
  const [data, setData] = useState<AdmissionsInfo>(DEFAULT_ADMISSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchAdmissions()
      .then((row) => {
        if (!alive) return;
        if (row) {
          setData(row);
          setFromDb(true);
        } else {
          setData(DEFAULT_ADMISSIONS);
          setFromDb(false);
        }
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลรับสมัครไม่สำเร็จ");
        setData(DEFAULT_ADMISSIONS);
        setFromDb(false);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error, fromDb };
}
