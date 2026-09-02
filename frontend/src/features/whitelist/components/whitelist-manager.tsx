"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { WhitelistCreateDialog } from "./whitelist-create-dialog";
import { WhitelistImportDialog } from "./whitelist-import-dialog";

export function WhitelistManager() {
  const [notice, setNotice] = useState<string | null>(null);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            จัดการรายชื่อ (ce_whitelist)
          </h2>
          <p className="text-sm text-muted-foreground">
            เพิ่มรายชื่อผู้มีสิทธิ์เข้าใช้งานระบบ ทีละคน หรือนำเข้าหลายคนพร้อมกันด้วยไฟล์ CSV
            (นักศึกษาจะกรอกรหัสนักศึกษาเองตอนลงทะเบียน)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WhitelistCreateDialog onCreated={() => flash("เพิ่มรายชื่อสำเร็จ")} />
          <WhitelistImportDialog onImported={() => flash("นำเข้ารายชื่อสำเร็จ")} />
        </div>
      </header>

      {notice ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {notice}
        </p>
      ) : null}

      <div className="rounded-lg border border-dashed border-border bg-card px-4 py-10 text-center">
        <p className="text-sm font-medium text-foreground">รายชื่อทั้งหมดของนักศึกษา</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ดูรายชื่อนักศึกษาที่มีอยู่แล้วผ่าน API{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/students</code>{" "}
          — เพิ่ม/แก้ไขทีละคนหรือนำเข้าไฟล์ CSV ได้จากปุ่มด้านบน
        </p>
      </div>
    </div>
  );
}
