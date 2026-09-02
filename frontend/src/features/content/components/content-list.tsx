"use client";

import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ChevronRight,
  Clapperboard,
  ClipboardList,
  Clock3,
  FileText,
  Images,
  Pencil,
  ScrollText,
  Trash2,
  UserRound,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContentItem, ContentType } from "../types";

type ContentListProps = {
  items: ContentItem[];
  loading?: boolean;
  /** staff ใช้การ์ดกริด สี่เหลี่ยม */
  layout?: "list" | "grid";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const typeIcons: Partial<Record<ContentType, LucideIcon>> = {
  curriculum: ScrollText,
  staff: UserRound,
  student_work: Images,
  about_us: Clapperboard,
  admissions: ClipboardList,
  career_path: BriefcaseBusiness,
  news: FileText,
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

function isImageUrl(url?: string) {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i.test(url);
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
      <p className="text-base font-medium text-foreground">ยังไม่มีข้อมูล</p>
      <p className="mt-2 text-sm text-muted-foreground">
        กดปุ่มเพิ่มข้อมูลเพื่อสร้างรายการแรก
      </p>
    </div>
  );
}

function ListThumb({ item }: { item: ContentItem }) {
  const Icon = typeIcons[item.type] ?? FileText;
  const imageUrl = isImageUrl(item.fileUrl) ? item.fileUrl : undefined;

  if (imageUrl) {
    return (
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="size-full object-cover" />
      </div>
    );
  }

  if (item.type === "staff") {
    const initial = item.title.trim().charAt(0) || "?";
    return (
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-neutral-100 text-sm font-semibold text-neutral-600"
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-neutral-50 text-neutral-500">
      <Icon className="size-4.5" strokeWidth={1.75} />
    </div>
  );
}

function ActionButtons({
  item,
  onEdit,
  onDelete,
  className,
}: {
  item: ContentItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-1.5", className)}>
      <button
        type="button"
        aria-label={`แก้ไข ${item.title}`}
        className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(item.id);
        }}
      >
        <Pencil className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label={`ลบ ${item.title}`}
        className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(item.id);
        }}
        disabled={!onDelete}
      >
        <Trash2 className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function ContentListSkeleton() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4"
        >
          <Skeleton className="size-11 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 max-w-md" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="size-9 rounded-xl" />
        </li>
      ))}
    </ul>
  );
}

function ContentGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col items-center rounded-2xl border border-border bg-white px-5 py-8"
        >
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="mt-4 h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </li>
      ))}
    </ul>
  );
}

function StaffGrid({
  items,
  onEdit,
  onDelete,
}: {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const imageUrl = isImageUrl(item.fileUrl) ? item.fileUrl : undefined;
        const initial = item.title.trim().charAt(0) || "?";

        return (
          <li key={item.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onEdit?.(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEdit?.(item.id);
                }
              }}
              className={cn(
                "group relative flex h-full cursor-pointer flex-col items-center rounded-2xl border border-border bg-white px-5 pt-8 pb-4 text-center shadow-sm transition-colors",
                "hover:border-neutral-300 hover:bg-neutral-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-border bg-neutral-100 shadow-sm ring-4 ring-neutral-50">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-2xl font-semibold text-neutral-400">
                    {initial}
                  </div>
                )}
              </div>

              <p className="mt-4 line-clamp-2 max-w-full text-[15px] font-semibold tracking-tight text-foreground">
                {item.title}
              </p>
              <p className="mt-1 line-clamp-1 max-w-full text-sm text-muted-foreground">
                {item.subtitle || "—"}
              </p>

              <div className="mt-4 flex justify-center">
                <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ContentList({
  items,
  loading,
  layout = "list",
  onEdit,
  onDelete,
}: ContentListProps) {
  if (loading) {
    return layout === "grid" ? <ContentGridSkeleton /> : <ContentListSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  if (layout === "grid") {
    return <StaffGrid items={items} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onEdit?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit?.(item.id);
              }
            }}
            className={cn(
              "group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-border bg-white px-4 py-3.5 text-left shadow-sm transition-colors",
              "hover:border-neutral-300 hover:bg-neutral-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <ListThumb item={item} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-foreground">
                {item.title}
              </p>
              {item.subtitle ? (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              ) : null}
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5 shrink-0" />
                <span>แก้ไขล่าสุด {formatUpdatedAt(item.updatedAt)}</span>
              </p>
            </div>

            <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
            <ChevronRight className="ml-0.5 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
        </li>
      ))}
    </ul>
  );
}
