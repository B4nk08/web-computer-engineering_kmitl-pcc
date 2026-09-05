"use client";

import { useEffect, useState } from "react";
import type { CurriculumProgram } from "@/features/curriculum";
import { fetchHomeCurriculum, fetchHomeShowcase, fetchHomeStaff } from "../api";
import type { HomeShowcaseItem, HomeStaffMember } from "../types";

type AsyncState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

export function useHomeStaff(): AsyncState<HomeStaffMember> {
  const [data, setData] = useState<HomeStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchHomeStaff()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลไม่สำเร็จ");
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

export function useHomeShowcase(): AsyncState<HomeShowcaseItem> {
  const [data, setData] = useState<HomeShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchHomeShowcase()
      .then((rows) => {
        if (!alive) return;
        setData(rows);
      })
      .catch(() => {
        if (!alive) return;
        setError("โหลดข้อมูลไม่สำเร็จ");
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

export function useHomeCurriculum() {
  const [data, setData] = useState<CurriculumProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchHomeCurriculum()
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
