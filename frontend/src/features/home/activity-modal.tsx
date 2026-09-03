"use client";

import { X } from "lucide-react";
import type { Activity } from "./data/activities";

/**
 * activity-modal.tsx
 * -------------------
 * ป็อปอัพแสดงรายละเอียดกิจกรรม เมื่อผู้ใช้กดที่รูปกิจกรรมในหน้า About Us
 * ปิดได้ทั้งกดปุ่ม X, กดพื้นหลังสีดำโปร่ง, หรือกด Esc (ผ่าน onClose ที่ส่งเข้ามา)
 */
export function ActivityModal({
  activity,
  onClose,
}: {
  activity: Activity | null;
  onClose: () => void;
}) {
  if (!activity) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activity.title}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
              {activity.date}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">{activity.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[var(--muted)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4 aspect-video w-full rounded-xl bg-[#d9d9d9]" />
        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{activity.description}</p>
      </div>
    </div>
  );
}
