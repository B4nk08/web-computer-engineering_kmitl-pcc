"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBadge, AdminCheckbox, AdminEmptyState } from "@/components/admin";
import { cn } from "@/lib/utils";
import type { NewsItem } from "../types";

type NewsListProps = {
  items: NewsItem[];
  loading?: boolean;
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (item: NewsItem) => void;
  deleting?: boolean;
};

function formatUpdatedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function NewsList({
  items,
  loading,
  selectedIds,
  onToggle,
  onEdit,
  onDelete,
  deleting,
}: NewsListProps) {
  if (loading) {
    return (
      <ul className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 rounded-2xl border border-border/80 bg-white px-4 py-4">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="size-11 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-56 max-w-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <AdminEmptyState
        title="ยังไม่มีข้อมูล"
        description="กดปุ่มเพิ่มข้อมูลเพื่อสร้างข่าวสารรายการแรก"
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => {
        const selected = selectedIds?.has(item.id) ?? false;
        return (
          <li
            key={item.id}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,29,63,0.08)] sm:gap-4",
              selected
                ? "border-[#d4652b]/50 bg-[#fff6ec]"
                : "border-border/80 hover:border-[#d4652b]/35"
            )}
          >
            {onToggle ? (
              <AdminCheckbox
                checked={selected}
                onCheckedChange={() => onToggle(item.id)}
                disabled={deleting}
              />
            ) : null}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e6] text-sm font-semibold text-[#d4652b]">
              {item.title.trim().slice(0, 1) || "ข"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{formatUpdatedAt(item.updatedAt)}</p>
            </div>
            {item.audience === "internal" ? (
              <AdminBadge tone="warning">ภายในสาขา</AdminBadge>
            ) : (
              <AdminBadge tone="info">รับสมัคร</AdminBadge>
            )}
            {item.isPublished ? (
              <AdminBadge tone="success">เผยแพร่</AdminBadge>
            ) : (
              <AdminBadge>ร่าง</AdminBadge>
            )}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label={`แก้ไข ${item.title}`}
                onClick={() => onEdit?.(item.id)}
                disabled={!onEdit || deleting}
              >
                <Pencil className="size-3.5" />
                แก้ไข
              </Button>
              {onDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`ลบ ${item.title}`}
                  onClick={() => onDelete(item)}
                  disabled={deleting}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
