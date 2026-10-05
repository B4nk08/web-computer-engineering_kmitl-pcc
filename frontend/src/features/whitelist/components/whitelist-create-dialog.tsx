"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { GraduationCap, Loader2, Shield, UserPlus, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminDialogFrame, AdminFormActions, AdminStatus } from "@/components/admin";
import { useAuth } from "@/features/auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createWhitelistEntry } from "../api";
import type { WhitelistRole } from "../types";

type WhitelistCreateDialogProps = {
  onCreated: () => void;
};

const ROLES: { value: WhitelistRole; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "student", label: "นักศึกษา", hint: "เมนูภายในสาขา", icon: GraduationCap },
  { value: "teacher", label: "อาจารย์", hint: "จัดการเนื้อหา", icon: UserRound },
  { value: "admin", label: "แอดมิน", hint: "จัดการทั้งระบบ", icon: Shield },
];

export function WhitelistCreateDialog({ onCreated }: WhitelistCreateDialogProps) {
  const { user } = useAuth();
  const roles = user?.role === "admin" ? ROLES.filter((item) => item.value !== "teacher") : ROLES;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [role, setRole] = useState<WhitelistRole>("student");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setEmail("");
    setFullName("");
    setStudentCode("");
    setRole("student");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createWhitelistEntry({
        email,
        full_name: fullName,
        role,
        student_code: role === "student" ? studentCode : "",
      });
      reset();
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "เพิ่มรายชื่อไม่สำเร็จ",
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
        title="เพิ่มรายชื่อ"
        description="คนนี้จะได้สิทธิ์ตามบทบาท เมื่อเข้าสู่ระบบด้วยอีเมลนี้"
        submitting={submitting}
        icon={<UserPlus className="size-4" aria-hidden />}
      >
        <form className="mt-1 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="whitelist-email">อีเมล</Label>
            <Input
              id="whitelist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@kmitl.ac.th"
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

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">บทบาท</legend>
            <div className={cn("grid gap-2", roles.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
              {roles.map(({ value, label, hint, icon: Icon }) => {
                const active = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={submitting}
                    onClick={() => setRole(value)}
                    className={cn(
                      "rounded-xl border px-2.5 py-3 text-left transition",
                      active
                        ? "border-[#1f4b82] bg-sky-50 shadow-[0_0_0_3px_rgba(31,75,130,0.12)]"
                        : "border-border bg-white hover:bg-slate-50",
                    )}
                    aria-pressed={active}
                  >
                    <Icon
                      className={cn("size-4", active ? "text-[#1f4b82]" : "text-muted-foreground")}
                      aria-hidden
                    />
                    <span className="mt-2 block text-sm font-semibold text-[#1c2430]">{label}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[#5c6778]">{hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {role === "student" ? (
            <div className="space-y-2">
              <Label htmlFor="whitelist-student-code">รหัสนักศึกษา</Label>
              <Input
                id="whitelist-student-code"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="6620001"
                inputMode="numeric"
                disabled={submitting}
              />
              <p className="text-xs text-[#5c6778]">2 หลักแรกใช้จัดรุ่น เช่น 66</p>
            </div>
          ) : null}

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
