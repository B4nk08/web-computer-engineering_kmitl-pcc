"use client";

import { useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { commitWhitelistImport, previewWhitelistImport } from "../api";
import type { WhitelistImportResultDto, WhitelistImportRowPreviewDto } from "../types";

type Step =
  | { kind: "select" }
  | { kind: "preview"; rows: WhitelistImportRowPreviewDto[] }
  | { kind: "result"; result: WhitelistImportResultDto };

const STATUS_LABEL: Record<string, string> = {
  new: "ใหม่",
  update: "อัปเดต",
  duplicate: "ซ้ำในไฟล์",
  error: "ผิดพลาด",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  update: "bg-amber-50 text-amber-700 border-amber-200",
  duplicate: "bg-orange-50 text-orange-700 border-orange-200",
  error: "bg-red-50 text-red-700 border-red-200",
};

type WhitelistImportDialogProps = {
  onImported: () => void;
};

export function WhitelistImportDialog({ onImported }: WhitelistImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "select" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  function resetAll() {
    setStep({ kind: "select" });
    setError(null);
    setSelected(new Set());
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const res = await previewWhitelistImport(file);
      setStep({ kind: "preview", rows: res.rows });
      // เลือกไว้ให้ล่วงหน้าเฉพาะแถวที่นำเข้าได้ (new/update) — error/duplicate ต้องแก้ไฟล์เอง
      const importable = new Set(
        res.rows
          .filter((r) => r.status === "new" || r.status === "update")
          .map((r) => r.line)
      );
      setSelected(importable);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "อ่านไฟล์ไม่สำเร็จ"
      );
    } finally {
      setBusy(false);
    }
  }

  function toggleRow(line: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  }

  async function handleConfirm() {
    if (step.kind !== "preview") return;
    const chosen = step.rows.filter((r) => selected.has(r.line));
    if (chosen.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      const result = await commitWhitelistImport(
        chosen.map((r) => ({
          line: r.line,
          email: r.email,
          full_name: r.full_name,
          role: r.role,
        }))
      );
      setStep({ kind: "result", result });
      onImported();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "นำเข้าไม่สำเร็จ"
      );
    } finally {
      setBusy(false);
    }
  }

  const summary = useMemo(() => {
    if (step.kind !== "preview") return null;
    return step.rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [step]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        setOpen(next);
        if (!next) resetAll();
      }}
    >
      <Dialog.Trigger asChild>
        <Button type="button">
          <Upload className="size-4" />
          นำเข้าไฟล์ CSV
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border bg-background p-6 shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                นำเข้ารายชื่อจากไฟล์ CSV
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                คอลัมน์ที่ต้องมี: email, full_name (หรือ name) — role ไม่บังคับ (เว้นว่าง = student)
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="ปิด"
                disabled={busy}
              >
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto">
            {step.kind === "select" ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
                <Upload className="size-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">เลือกไฟล์ .csv เพื่อตรวจสอบก่อนนำเข้า</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ตัวอย่างหัวตาราง: email,full_name,role
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    void handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  เลือกไฟล์
                </Button>
              </div>
            ) : null}

            {step.kind === "preview" ? (
              <div className="space-y-3">
                {summary ? (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      ใหม่ {summary.new ?? 0}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
                      อัปเดต {summary.update ?? 0}
                    </span>
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-orange-700">
                      ซ้ำในไฟล์ {summary.duplicate ?? 0}
                    </span>
                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700">
                      ผิดพลาด {summary.error ?? 0}
                    </span>
                  </div>
                ) : null}

                <div className="max-h-[45vh] overflow-y-auto rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-muted/60 text-xs text-muted-foreground">
                      <tr>
                        <th className="w-10 px-3 py-2" />
                        <th className="px-3 py-2">แถว</th>
                        <th className="px-3 py-2">อีเมล</th>
                        <th className="px-3 py-2">ชื่อ-นามสกุล</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.rows.map((row) => {
                        const disabled = row.status === "error" || row.status === "duplicate";
                        return (
                          <tr key={row.line} className="border-t border-border">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={selected.has(row.line)}
                                disabled={disabled}
                                onChange={() => toggleRow(row.line)}
                              />
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{row.line}</td>
                            <td className="px-3 py-2">{row.email}</td>
                            <td className="px-3 py-2">{row.full_name}</td>
                            <td className="px-3 py-2">{row.role}</td>
                            <td className="px-3 py-2">
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-xs",
                                  STATUS_STYLE[row.status]
                                )}
                                title={row.error}
                              >
                                {STATUS_LABEL[row.status] ?? row.status}
                              </span>
                              {row.status === "update" && row.existing_full_name ? (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  เดิม: {row.existing_full_name} ({row.existing_role})
                                </p>
                              ) : null}
                              {row.error ? (
                                <p className="mt-1 text-xs text-red-600">{row.error}</p>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {step.kind === "result" ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-6 py-10 text-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">นำเข้าเสร็จแล้ว</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    เพิ่มใหม่ {step.result.inserted} · อัปเดต {step.result.updated} · ข้าม{" "}
                    {step.result.skipped}
                  </p>
                </div>
                {step.result.errors && step.result.errors.length > 0 ? (
                  <ul className="mt-2 w-full space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-700">
                    {step.result.errors.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
            {step.kind === "preview" ? (
              <>
                <Button type="button" variant="outline" onClick={resetAll} disabled={busy}>
                  เลือกไฟล์ใหม่
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleConfirm()}
                  disabled={busy || selected.size === 0}
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  ยืนยันนำเข้า {selected.size} รายการ
                </Button>
              </>
            ) : null}
            {step.kind === "result" ? (
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetAll();
                }}
              >
                ปิด
              </Button>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
