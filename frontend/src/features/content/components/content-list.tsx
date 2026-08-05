"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentItem } from "../types";

type ContentListProps = {
  items: ContentItem[];
  loading?: boolean;
  onEdit?: (id: string) => void;
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

function ListHeader() {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <span>ชื่อ</span>
      <span className="w-24 text-center">สถานะ</span>
      <span className="w-40 text-right">แก้ไขล่าสุด</span>
      <span className="w-10" />
    </div>
  );
}

function ContentListSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <ListHeader />
      <ul className="divide-y">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3"
          >
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="mx-auto h-5 w-16 rounded-full" />
            <Skeleton className="ml-auto h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentList({ items, loading, onEdit }: ContentListProps) {
  if (loading) {
    return <ContentListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-12 text-center">
        <p className="text-sm font-medium text-foreground">ยังไม่มีข้อมูล</p>
        <p className="mt-1 text-sm text-muted-foreground">
          กดปุ่มเพิ่มข้อมูลเพื่อสร้างรายการแรก
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <ListHeader />
      <ul className="divide-y">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              {item.slug ? (
                <p className="truncate text-xs text-muted-foreground">/{item.slug}</p>
              ) : null}
            </div>
            <span
              className={
                item.isPublished
                  ? "inline-flex w-24 justify-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  : "inline-flex w-24 justify-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
              }
            >
              {item.isPublished ? "เผยแพร่" : "ร่าง"}
            </span>
            <span className="w-40 text-right text-sm text-muted-foreground">
              {formatUpdatedAt(item.updatedAt)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              aria-label={`แก้ไข ${item.title}`}
              onClick={() => onEdit?.(item.id)}
              disabled={!onEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
