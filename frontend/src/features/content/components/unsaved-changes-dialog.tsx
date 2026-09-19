"use client";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";

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
    <AdminConfirmDialog
      open={open}
      title={title}
      description={description}
      confirmLabel={discardLabel}
      cancelLabel={stayLabel}
      tone="danger"
      onConfirm={onDiscard}
      onOpenChange={(next) => {
        if (!next) onStay();
        onOpenChange(next);
      }}
    />
  );
}
