"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FolderPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { createExamSubject } from "../../api";

type ExamSubjectCreateDialogProps = {
  onCreated: () => void;
};

export function ExamSubjectCreateDialog({ onCreated }: ExamSubjectCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setCode("");
    setName("");
    setDescription("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createExamSubject({ code, name, description });
      reset();
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "เพิ่มกลุ่มข้อสอบไม่สำเร็จ"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!submitting) {
          setOpen(next);
          if (!next) reset();
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button type="button" variant="outline">
          <FolderPlus className="size-4" />
          เพิ่มกลุ่ม
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                เพิ่มกลุ่มข้อสอบ
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                เช่น software, iot — code ใช้ตัวเล็ก a-z 0-9 _ - และแก้ทีหลังไม่ได้
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" disabled={submitting} aria-label="ปิด">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="exam-subject-code">Code</Label>
              <Input
                id="exam-subject-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toLowerCase())}
                placeholder="software"
                pattern="[a-z0-9_-]{2,32}"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-subject-name">ชื่อที่แสดง</Label>
              <Input
                id="exam-subject-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Software"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-subject-desc">คำอธิบาย (ไม่บังคับ)</Label>
              <Input
                id="exam-subject-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="กลุ่มวิชาด้านซอฟต์แวร์"
                disabled={submitting}
              />
            </div>

            {error ? (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                เพิ่มกลุ่ม
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
