"use client";

import { useState } from "react";
import { AdminEmptyState, AdminPageFrame, AdminStatus } from "@/components/admin";
import { WhitelistCreateDialog } from "./whitelist-create-dialog";
import { WhitelistImportDialog } from "./whitelist-import-dialog";

export function WhitelistManager() {
  const [notice, setNotice] = useState<string | null>(null);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  }

  return (
    <AdminPageFrame
      title="จัดการรายชื่อ (ce_whitelist)"
      description="เพิ่มรายชื่อผู้มีสิทธิ์เข้าใช้งานระบบ ทีละคน หรือนำเข้าหลายคนพร้อมกันด้วยไฟล์ CSV (นักศึกษาจะกรอกรหัสนักศึกษาเองตอนลงทะเบียน)"
      actions={
        <>
          <WhitelistCreateDialog onCreated={() => flash("เพิ่มรายชื่อสำเร็จ")} />
          <WhitelistImportDialog onImported={() => flash("นำเข้ารายชื่อสำเร็จ")} />
        </>
      }
    >
      {notice ? <AdminStatus tone="success">{notice}</AdminStatus> : null}

      <AdminEmptyState
        title="เพิ่มรายชื่อผู้มีสิทธิ์เข้าใช้ระบบ"
        description="ดูรายชื่อนักศึกษาที่มีอยู่แล้วผ่าน API GET /api/students — เพิ่ม/แก้ไขทีละคนหรือนำเข้าไฟล์ CSV ได้จากปุ่มด้านบน"
      />
    </AdminPageFrame>
  );
}
