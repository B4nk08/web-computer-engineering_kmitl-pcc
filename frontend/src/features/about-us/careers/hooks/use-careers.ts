"use client";

import { useMemo } from "react";
import { useAsyncData } from "@/lib/use-async-data";
import { fetchCareers } from "../api";
import { listCareerClusters, type CareerClusterDto } from "@/features/quiz/api";
import type { CareerPath } from "../types";

export function useCareers() {
  const { data, loading, error } = useAsyncData(
    () =>
      Promise.all([
        fetchCareers(),
        listCareerClusters().catch(() => [] as CareerClusterDto[]),
      ]),
    [[], []] as [CareerPath[], CareerClusterDto[]],
    "โหลดเส้นทางอาชีพไม่สำเร็จ",
  );

  return { data: data[0], clusters: data[1], loading, error };
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
