"use client";

import { useMemo, useState } from "react";
import { AdminEmptyState, AdminPageFrame, AdminStatus } from "@/components/admin";
import { Input } from "@/components/ui/input";
import { LoadingRow } from "@/components/ui/loading-row";
import { useAsyncData } from "@/lib/use-async-data";
import { cn } from "@/lib/utils";
import { listWhitelist } from "../api";
import type { WhitelistEntryDto } from "../types";
import { WhitelistCreateDialog } from "./whitelist-create-dialog";
import { WhitelistImportDialog } from "./whitelist-import-dialog";

const ROLE_LABEL: Record<string, string> = {
  student: "นักศึกษา",
  teacher: "อาจารย์",
  admin: "แอดมิน",
};

const ROLE_CLASS: Record<string, string> = {
  student: "bg-sky-50 text-sky-800",
  teacher: "bg-amber-50 text-amber-800",
  admin: "bg-violet-50 text-violet-800",
};

export function WhitelistManager() {
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);

  const { data, loading, error } = useAsyncData(
    () => listWhitelist(),
    [] as WhitelistEntryDto[],
    "โหลดรายชื่อไม่สำเร็จ",
    [version],
  );

  function flash(message: string) {
    setNotice(message);
    setVersion((current) => current + 1);
    window.setTimeout(() => setNotice(null), 4000);
  }

  const shown = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;
    return data.filter((row) =>
      [row.full_name, row.email, row.student_code, row.cohort, ROLE_LABEL[row.role]]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [data, query]);

  return (
    <AdminPageFrame
      title="รายชื่อผู้มีสิทธิ์เข้าใช้ระบบ"
      description="คนในรายชื่อนี้เข้าสู่ระบบด้วยอีเมลนี้ได้ ตามบทบาทที่กำหนด"
      actions={
        <>
          <WhitelistCreateDialog onCreated={() => flash("เพิ่มรายชื่อสำเร็จ")} />
          <WhitelistImportDialog onImported={() => flash("นำเข้ารายชื่อสำเร็จ")} />
        </>
      }
    >
      {notice ? <AdminStatus tone="success">{notice}</AdminStatus> : null}
      {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

      {loading ? <LoadingRow label="กำลังโหลดรายชื่อ..." /> : null}

      {!loading && !error && data.length === 0 ? (
        <AdminEmptyState
          title="ยังไม่มีรายชื่อ"
          description="กดเพิ่มรายชื่อ หรือนำเข้าจากไฟล์ ที่มุมขวาบน"
        />
      ) : null}

      {!loading && !error && data.length > 0 ? (
        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">ทั้งหมด {data.length} คน</p>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชื่อ อีเมล หรือรหัส"
              className="sm:max-w-xs"
            />
          </div>

          {shown.length === 0 ? (
            <AdminEmptyState title="ไม่พบรายชื่อที่ค้นหา" description="ลองคำอื่น หรือล้างช่องค้นหา" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">ชื่อ</th>
                      <th className="px-4 py-3 font-medium">อีเมล</th>
                      <th className="px-4 py-3 font-medium">บทบาท</th>
                      <th className="px-4 py-3 font-medium">รหัส / รุ่น</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">{row.full_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                              ROLE_CLASS[row.role] ?? "bg-muted text-foreground",
                            )}
                          >
                            {ROLE_LABEL[row.role] ?? row.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.student_code ? (
                            <>
                              {row.student_code}
                              {row.cohort ? <span className="text-foreground"> · {row.cohort}</span> : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </AdminPageFrame>
  );
}
