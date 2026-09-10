"use client";

import { Building2, FileText, Loader2 } from "lucide-react";
import {
  AboutUsDoc,
  AboutUsDocMeta,
  AboutUsDocTitle,
  AboutUsFieldList,
  AboutUsStatBar,
} from "../../components/about-us-doc";
import { AboutUsPageHeader } from "../../components/about-us-page-header";
import { useCurriculum } from "../hooks/use-curriculum";

const DEFAULT_CAMPUS =
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง คณะ/วิทยาเขต/วิทยาลัย วิทยาเขตชุมพรเขตรอุดมศักดิ์";

/**
 * หน้า /about-us/beng — หัวข้อหน้า + เอกสารหลักสูตร (แถบสรุป / การ์ดแถวข้อมูล)
 */
export function BengCurriculumView() {
  const { data, loading, error } = useCurriculum();

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[var(--surface)]">
      <AboutUsPageHeader
        eyebrow="CURRICULUM"
        title="หลักสูตร"
        description="รายละเอียดหลักสูตรวิศวกรรมคอมพิวเตอร์ — โครงสร้าง ระยะเวลา และเอกสารหลักสูตร"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" />
            <span className="ml-2 text-sm text-[var(--ink-soft)]">
              กำลังโหลดข้อมูลหลักสูตร...
            </span>
          </div>
        ) : error || !data ? (
          <p className="text-sm text-[var(--ink-soft)]">
            {error ?? "ยังไม่มีข้อมูลหลักสูตรที่เผยแพร่"}
          </p>
        ) : (
          <AboutUsDoc>
            <AboutUsDocTitle
              title={data.title}
              titleEn={data.titleEn}
              action={
                data.pdfUrl ? (
                  <a
                    href={data.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-900)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-800)] sm:text-sm"
                  >
                    PDF
                    <FileText className="size-3.5" aria-hidden />
                  </a>
                ) : undefined
              }
            />

            <AboutUsDocMeta icon={<Building2 className="size-3.5" aria-hidden />}>
              {DEFAULT_CAMPUS}
            </AboutUsDocMeta>

            <AboutUsStatBar items={data.summary} />
            <AboutUsFieldList rows={data.fields} />
          </AboutUsDoc>
        )}
      </div>
    </div>
  );
}
