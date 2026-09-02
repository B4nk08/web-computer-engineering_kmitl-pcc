"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { createWhitelistEntry } from "../api";
import type { WhitelistRole } from "../types";

type WhitelistCreateDialogProps = {
  onCreated: () => void;
};

const ROLE_OPTIONS: { value: WhitelistRole | ""; label: string }[] = [
  { value: "", label: "นักศึกษา (student) — ค่าเริ่มต้น" },
  { value: "student", label: "นักศึกษา (student)" },
  { value: "teacher", label: "อาจารย์ (teacher)" },
  { value: "admin", label: "แอดมิน (admin)" },
];

export function WhitelistCreateDialog({ onCreated }: WhitelistCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<WhitelistRole | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setEmail("");
    setFullName("");
    setRole("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createWhitelistEntry({ email, full_name: fullName, role });
      reset();
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "เพิ่มรายชื่อไม่สำเร็จ"
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
          <UserPlus className="size-4" />
          เพิ่มทีละคน
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                เพิ่มรายชื่อทีละคน
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                เพิ่มเข้า ce_whitelist โดยตรง — ถ้าไม่เลือก role จะเป็นนักศึกษาโดยอัตโนมัติ
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="ปิด"
                disabled={submitting}
              >
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="whitelist-email">อีเมล</Label>
              <Input
                id="whitelist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="somchai@kmitl.ac.th"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whitelist-full-name">ชื่อ-นามสกุล</Label>
              <Input
                id="whitelist-full-name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="สมชาย ใจดี"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whitelist-role">บทบาท (Role)</Label>
              <select
                id="whitelist-role"
                value={role}
                onChange={(e) => setRole(e.target.value as WhitelistRole | "")}
                disabled={submitting}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
                เพิ่มรายชื่อ
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
