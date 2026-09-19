"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminDialogFrame, AdminFormActions, AdminSelect, AdminStatus } from "@/components/admin";
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
  const [studentCode, setStudentCode] = useState("");
  const [role, setRole] = useState<WhitelistRole | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setEmail("");
    setFullName("");
    setStudentCode("");
    setRole("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createWhitelistEntry({ email, full_name: fullName, role, student_code: studentCode });
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
      <AdminDialogFrame
        title="เพิ่มรายชื่อทีละคน"
        description="เพิ่มเข้า ce_whitelist โดยตรง — ถ้าไม่เลือก role จะเป็นนักศึกษาโดยอัตโนมัติ"
        submitting={submitting}
      >
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
              <Label htmlFor="whitelist-student-code">รหัสนักศึกษา</Label>
              <Input
                id="whitelist-student-code"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="6620001"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                ใช้แยกรุ่นในหน้ารายชื่อชั้นปี จาก 2 หลักแรก เช่น 66 → เพื่อนรหัสเดียวกัน
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whitelist-role">บทบาท (Role)</Label>
              <AdminSelect
                id="whitelist-role"
                value={role}
                onChange={(e) => setRole(e.target.value as WhitelistRole | "")}
                disabled={submitting}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </AdminSelect>
            </div>

            {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

            <AdminFormActions>
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                เพิ่มรายชื่อ
              </Button>
            </AdminFormActions>
          </form>
      </AdminDialogFrame>
    </Dialog.Root>
  );
}
