"use client";

import { LoadingRow } from "@/components/ui/loading-row";

import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useActivities } from "../hooks/use-activities";
import { ActivityCard } from "./activity-card";

/**
 * หน้า /about-us/activities — การ์ดเต็มแถว สลับรูปซ้าย/ขวา
 */
export function ActivitiesListingView() {
  const { data, loading, error } = useActivities();

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader eyebrow="ACTIVITIES" title="กิจกรรม" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingRow label="กำลังโหลดกิจกรรม..." />
          </div>
        ) : error ? (
          <p className="text-sm text-[var(--ink-soft)]">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)]">
            ยังไม่มีกิจกรรมที่เผยแพร่ — เพิ่มได้ที่ Admin → กิจกรรม
          </p>
        ) : (
          <div className="space-y-5">
            {data.map((item, index) => (
              <ActivityCard key={item.id} item={item} reverse={index % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
