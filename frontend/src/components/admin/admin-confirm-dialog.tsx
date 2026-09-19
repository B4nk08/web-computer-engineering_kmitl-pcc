"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Trash2 } from "lucide-react";
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
  danger: (
    <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
      <Trash2 className="size-5" aria-hidden />
    </span>
  ),
  neutral: null,
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
        <Dialog.Content className="admin-dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[26rem] -translate-x-1/2 -translate-y-1/2 bg-white outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          {headingIcon ? <div className="mb-4">{headingIcon}</div> : null}
          <Dialog.Title className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </Dialog.Description>
          <div className="mt-7 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={confirming}
              className="h-10 rounded-full border-[#152038]/20 px-5 text-[#152038] hover:bg-[#152038] hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={tone === "danger" ? "destructive" : "default"}
              disabled={confirming}
              className={cn(
                "h-10 rounded-full px-5",
                tone === "danger" && "bg-red-600 hover:bg-red-700",
              )}
              onClick={onConfirm}
            >
              {confirming ? <Loader2 className="size-4 animate-spin" /> : null}
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
