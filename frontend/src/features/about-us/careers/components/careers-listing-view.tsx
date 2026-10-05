"use client";

import { LoadingRow } from "@/components/ui/loading-row";

import { useState } from "react";
import { clusterTheme } from "@/config/cluster-theme";
import type { CareerClusterDto } from "@/features/quiz/api";
import { cn } from "@/lib/utils";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useGroupedCareers } from "../hooks/use-careers";
import type { CareerPath } from "../types";
import { CareerDetailModal } from "./career-detail-modal";

/** หัวข้อกลุ่มบนหน้า careers — ใช้ภาษาอังกฤษ */
const CLUSTER_HEADING_EN: Record<string, string> = {
  software: "Software",
  iot: "IoT",
  network: "Network",
  data: "Data",
};

function clusterHeading(cluster: CareerClusterDto | null): string {
  if (!cluster) return "Other";
  const fromApi = cluster.name_en?.trim();
  if (fromApi) return fromApi;
  return CLUSTER_HEADING_EN[cluster.code] ?? cluster.name;
}

function clusterBar(code: string | undefined): string {
  return clusterTheme(code).bar;
}

function CareerCard({
  item,
  clusterCode,
  onOpen,
}: {
  item: CareerPath;
  clusterCode?: string;
  onOpen: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-[var(--border)] bg-white p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[var(--navy-900)]/25 hover:shadow-[0_12px_28px_rgba(15,29,63,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-900)]/30 sm:p-6"
    >
      <div
        className={cn(
          "mb-3 h-1 w-8 rounded-full transition group-hover:w-12",
          clusterBar(clusterCode ?? item.clusterCode),
        )}
      />
      {item.role ? (
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-[var(--ink-soft)] uppercase">
          {item.role}
        </p>
      ) : null}
      <h2 className="text-base font-semibold leading-snug text-[var(--ink)] sm:text-[17px]">
        {item.title}
      </h2>
      {item.detail ? (
        <p className="mt-2.5 line-clamp-5 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
          {item.detail}
        </p>
      ) : null}
      <span className="mt-4 text-xs font-medium text-[#2f5fd6] opacity-0 transition group-hover:opacity-100">
        ดูรายละเอียด →
      </span>
    </article>
  );
}

/**
 * หน้า /about-us/careers — อาชีพหลังจบการศึกษา
 */
export function CareersListingView() {
  const { groups, loading, error } = useGroupedCareers();
  const [selected, setSelected] = useState<{
    item: CareerPath;
    clusterLabel: string;
  } | null>(null);

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="CAREER PATH"
        title="เส้นทางอาชีพ"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingRow label="กำลังโหลดเส้นทางอาชีพ..." />
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีเส้นทางอาชีพที่เผยแพร่ — เพิ่มได้ที่ Admin → เส้นทางอาชีพ
          </p>
        ) : (
          <>
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.cluster?.code ?? "other"}>
                  <h2 className="text-lg font-semibold text-[var(--navy-900)]">
                    {clusterHeading(group.cluster)}
                  </h2>
                  {group.cluster?.description ? (
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{group.cluster.description}</p>
                  ) : null}
                  <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <CareerCard
                        key={item.id}
                        item={item}
                        clusterCode={group.cluster?.code}
                        onOpen={() =>
                          setSelected({
                            item,
                            clusterLabel: clusterHeading(group.cluster),
                          })
                        }
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {selected ? (
              <CareerDetailModal
                item={selected.item}
                clusterLabel={selected.clusterLabel}
                onClose={() => setSelected(null)}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
