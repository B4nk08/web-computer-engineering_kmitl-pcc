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
      onClick={(e) => e.stopPropagation()}
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
        className="size-4 shrink-0 accent-primary"
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
  if (total === 0 || selectedCount === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#1f4b82]/15 bg-white py-2 pr-2 pl-4 shadow-[0_16px_40px_rgba(22,50,92,0.18)]">
        <span className="text-sm font-medium text-[#1c2430]">
          เลือก {selectedCount}
          <span className="font-normal text-[#5c6778]"> / {total}</span>
        </span>
        {!allSelected && someSelected ? (
          <button
            type="button"
            disabled={deleting}
            onClick={() => onToggleAll(true)}
            className="rounded-full px-2.5 py-1 text-sm font-medium text-[#1f4b82] hover:bg-sky-50 disabled:opacity-50"
          >
            ทั้งหมด
          </button>
        ) : null}
        <span className="mx-0.5 h-4 w-px bg-[#e3e8f0]" aria-hidden />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={() => onToggleAll(false)}
          className="h-8 rounded-full px-3 text-[#5c6778] hover:bg-[#f4f6f9]"
        >
          ยกเลิก
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={deleting}
          onClick={onDeleteSelected}
          className="h-8 rounded-full bg-rose-600 px-3.5 text-white hover:bg-rose-700"
        >
          <Trash2 className="size-3.5" />
          ลบ
        </Button>
      </div>
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
