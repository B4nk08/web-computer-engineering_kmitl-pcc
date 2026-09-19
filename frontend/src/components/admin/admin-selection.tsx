"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";

export function AdminCheckbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  label,
  disabled,
  className,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel ?? (label ? undefined : "เลือก")}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate && !checked;
        }}
        onChange={(e) => onCheckedChange(e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        className="size-4 shrink-0 accent-[#d4652b]"
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export function AdminSelectionBar({
  total,
  selectedCount,
  allSelected,
  someSelected,
  onToggleAll,
  onDeleteSelected,
  deleting,
}: {
  total: number;
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onDeleteSelected: () => void;
  deleting?: boolean;
}) {
  if (total === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/30 px-4 py-3">
      <AdminCheckbox
        checked={allSelected}
        indeterminate={someSelected}
        onCheckedChange={onToggleAll}
        disabled={deleting}
        label={
          selectedCount > 0
            ? `เลือกแล้ว ${selectedCount} รายการ`
            : "เลือกทั้งหมด"
        }
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={selectedCount === 0 || deleting}
        onClick={onDeleteSelected}
      >
        <Trash2 className="size-3.5" />
        ลบที่เลือก
      </Button>
    </div>
  );
}

export function useAdminSelection(ids: string[]) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const idKey = ids.join("|");

  useEffect(() => {
    const valid = new Set(idKey ? idKey.split("|") : []);
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => valid.has(id)));
      if (next.size === prev.size && [...next].every((id) => prev.has(id))) {
        return prev;
      }
      return next;
    });
  }, [idKey]);

  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = selected.size > 0 && !allSelected;
  const selectedIds = useMemo(() => [...selected], [selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setAll(checked: boolean) {
    setSelected(checked ? new Set(ids) : new Set());
  }

  function clear() {
    setSelected(new Set());
  }

  return {
    selected,
    selectedIds,
    count: selected.size,
    allSelected,
    someSelected,
    toggle,
    setAll,
    clear,
  };
}

export async function deleteMany(
  ids: string[],
  deleteOne: (id: string) => Promise<void>
): Promise<{ ok: number; failed: number; message: string | null }> {
  const results = await Promise.allSettled(ids.map((id) => deleteOne(id)));
  let ok = 0;
  let failed = 0;
  let message: string | null = null;

  for (const result of results) {
    if (result.status === "fulfilled") {
      ok += 1;
      continue;
    }
    failed += 1;
    if (!message) {
      const reason = result.reason;
      message =
        reason instanceof ApiError
          ? reason.message
          : reason instanceof Error
            ? reason.message
            : "ลบบางรายการไม่สำเร็จ";
    }
  }

  return { ok, failed, message };
}

export type PendingDelete = {
  ids: string[];
  label: string;
};

export function deleteConfirmCopy(pending: PendingDelete | null) {
  if (!pending) {
    return { title: "ลบข้อมูล", description: "" };
  }
  if (pending.ids.length > 1) {
    return {
      title: `ลบ ${pending.ids.length} รายการ?`,
      description: `ต้องการลบ ${pending.label} หรือไม่ ข้อมูลที่ลบแล้วกู้คืนไม่ได้`,
    };
  }
  return {
    title: "ลบรายการนี้?",
    description: `ต้องการลบ “${pending.label}” หรือไม่ ข้อมูลที่ลบแล้วกู้คืนไม่ได้`,
  };
}
