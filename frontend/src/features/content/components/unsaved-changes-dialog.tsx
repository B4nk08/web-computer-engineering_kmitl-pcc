"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type UnsavedChangesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onStay: () => void;
  title?: string;
  description?: string;
  stayLabel?: string;
  discardLabel?: string;
};

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onStay,
  title = "มีการแก้ไขที่ยังไม่ได้บันทึก",
  description = "หากออกตอนนี้ การเปลี่ยนแปลงจะหายไป คุณต้องการออกโดยไม่บันทึกหรือไม่?",
  stayLabel = "อยู่ต่อ",
  discardLabel = "ออกโดยไม่บันทึก",
}: UnsavedChangesDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <Dialog.Title className="text-lg font-semibold tracking-tight">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onStay}>
              {stayLabel}
            </Button>
            <Button type="button" variant="destructive" onClick={onDiscard}>
              {discardLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
