"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Info, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmTone = "danger" | "neutral";

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  tone?: ConfirmTone;
  icon?: ReactNode;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

const TONE_ICON: Record<ConfirmTone, ReactNode> = {
  danger: <Trash2 className="size-4" aria-hidden />,
  neutral: <Info className="size-4" aria-hidden />,
};

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "ลบ",
  cancelLabel = "ยกเลิก",
  confirming = false,
  tone = "danger",
  icon,
  onConfirm,
  onOpenChange,
}: AdminConfirmDialogProps) {
  const headingIcon = icon ?? TONE_ICON[tone];

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (confirming) return;
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="admin-dialog-overlay fixed inset-0 z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="admin-dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[26rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-start gap-3 px-5 pt-5 pb-4">
            <span
              className={cn(
                "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border",
                tone === "danger"
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-sky-200 bg-sky-50 text-[#1f4b82]"
              )}
            >
              {headingIcon}
            </span>
            <div className="min-w-0 pt-0.5">
              <Dialog.Title className="text-[15px] font-semibold leading-snug text-[#1c2430]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] leading-relaxed text-[#5c6778]">
                {description}
              </Dialog.Description>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-[#e6ebf2] bg-[#f7f9fc] px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={confirming}
              className="admin-dialog-cancel h-8 rounded-lg px-3.5"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={confirming}
              className={cn(
                "admin-dialog-confirm h-8 rounded-lg px-3.5",
                tone === "danger" && "admin-dialog-confirm-danger"
              )}
              onClick={onConfirm}
            >
              {confirming ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
