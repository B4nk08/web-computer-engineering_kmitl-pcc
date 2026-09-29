"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCareers } from "../api";
import { listCareerClusters, type CareerClusterDto } from "@/features/quiz/api";
import type { CareerPath } from "../types";

type State = {
  data: CareerPath[];
  clusters: CareerClusterDto[];
  loading: boolean;
  error: string | null;
};

export function useCareers(): State {
  const [data, setData] = useState<CareerPath[]>([]);
  const [clusters, setClusters] = useState<CareerClusterDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([fetchCareers(), listCareerClusters().catch(() => [] as CareerClusterDto[])])
      .then(([rows, clusterRows]) => {
        if (!alive) return;
        setData(rows);
        setClusters(clusterRows);
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

  return { data, clusters, loading, error };
}

export function groupCareersByCluster(
  careers: CareerPath[],
  clusters: CareerClusterDto[]
): { cluster: CareerClusterDto | null; items: CareerPath[] }[] {
  const byCode = new Map<string, CareerPath[]>();
  const ungrouped: CareerPath[] = [];
  for (const career of careers) {
    if (!career.clusterCode) {
      ungrouped.push(career);
      continue;
    }
    const list = byCode.get(career.clusterCode) ?? [];
    list.push(career);
    byCode.set(career.clusterCode, list);
  }

  const grouped: { cluster: CareerClusterDto | null; items: CareerPath[] }[] = clusters
    .map((cluster) => ({ cluster, items: byCode.get(cluster.code) ?? [] }))
    .filter((group) => group.items.length > 0);

  const known = new Set(clusters.map((c) => c.code));
  for (const [code, items] of byCode) {
    if (!known.has(code)) {
      grouped.push({
        cluster: {
          code,
          name: code,
          name_en: "",
          description: "",
          image_url: "",
          sort_order: 99,
        },
        items,
      });
    }
  }
  if (ungrouped.length > 0) {
    grouped.push({ cluster: null, items: ungrouped });
  }
  return grouped;
}

export function useGroupedCareers() {
  const state = useCareers();
  const groups = useMemo(
    () => groupCareersByCluster(state.data, state.clusters),
    [state.data, state.clusters]
  );
  return { ...state, groups };
}
