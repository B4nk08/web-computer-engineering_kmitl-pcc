"use client";

import Link from "next/link";
import { ExternalLink, FileText, GraduationCap, Loader2 } from "lucide-react";
import {
  AboutUsDoc,
  AboutUsDocMeta,
  AboutUsDocTitle,
  AboutUsFieldList,
  AboutUsStatBar,
} from "../../components/about-us-doc";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useAdmissions } from "../hooks/use-admissions";

/**
 * หน้า /about-us/admission-requirements
 * แสดงข้อมูลแบบเดียวกับหน้าหลักสูตร — แถบสรุป + การ์ดแถว label/value
 */
export function AdmissionsView() {
  const { data, loading } = useAdmissions();

  const stats: { value: string; label: string }[] = [];
  if (data.quota) stats.push({ value: data.quota, label: "จำนวนรับ" });
  if (data.tuition) stats.push({ value: data.tuition, label: "ค่าเทอม" });
  if (data.qualifications.length > 0) {
    stats.push({ value: String(data.qualifications.length), label: "ข้อคุณสมบัติ" });
  }
  if (stats.length < 3 && data.supportItems.length > 0) {
    stats.push({ value: String(data.supportItems.length), label: "การดูแลแรกเข้า" });
  }

  const extraFields = data.body
    ? [{ label: "รายละเอียด", value: <span className="whitespace-pre-line">{data.body}</span> }]
    : [];

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="ADMISSIONS"
        title="คุณสมบัติ"
        description="คุณสมบัติผู้สมัคร เอกสารที่ต้องใช้ และการดูแลนักศึกษาแรกเข้า"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">กำลังโหลด...</span>
          </div>
        ) : (
          <AboutUsDoc>
            <AboutUsDocTitle
              title={data.title}
              titleEn={data.titleEn}
              action={
                <>
                  <Link
                    href="/about-us/beng"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-900)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-800)] sm:text-sm"
                  >
                    ดูหลักสูตร
                    <FileText className="size-3.5" aria-hidden />
                  </Link>
                  {data.applyUrl ? (
                    <a
                      href={data.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--navy-900)] transition hover:border-[var(--navy-900)]/40 sm:text-sm"
                    >
                      สมัครเรียน
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </>
              }
            />

            <AboutUsDocMeta icon={<GraduationCap className="size-3.5" aria-hidden />}>
              คุณสมบัติผู้สมัคร เอกสาร และการดูแลนักศึกษาแรกเข้า
            </AboutUsDocMeta>

            <AboutUsStatBar items={stats} />

            {extraFields.length > 0 ? <AboutUsFieldList rows={extraFields} /> : null}

            <AboutUsFieldList
              heading="คุณสมบัติของผู้เข้าศึกษา"
              rows={data.qualifications.map((q, i) => ({
                label: `ข้อ ${i + 1}`,
                value: q,
              }))}
              empty="ยังไม่มีข้อมูลคุณสมบัติ — เพิ่มได้ที่ Admin → ข้อมูลรับสมัคร"
            />

            {data.documents.length > 0 ? (
              <AboutUsFieldList
                heading="เอกสารที่ต้องใช้"
                rows={data.documents.map((doc, i) => ({
                  label: `เอกสาร ${i + 1}`,
                  value: doc,
                }))}
              />
            ) : null}

            <AboutUsFieldList
              heading="การดูแลนักศึกษาแรกเข้า"
              rows={data.supportItems.map((item) => ({
                label: item.title,
                value: item.detail || "—",
              }))}
              empty="ยังไม่มีข้อมูลการดูแลนักศึกษาแรกเข้า"
            />
          </AboutUsDoc>
        )}
      </div>
    </div>
  );
}
