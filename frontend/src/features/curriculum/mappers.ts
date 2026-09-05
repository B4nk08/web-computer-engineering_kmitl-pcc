import type { ContentDetail } from "@/features/content";
import type { CurriculumProgram } from "./types";

function str(extra: Record<string, unknown> | null, key: string): string {
  const value = extra?.[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export function mapCurriculum(item: ContentDetail): CurriculumProgram {
  const extra = item.extra;
  const years = str(extra, "duration_years");
  const credits = str(extra, "total_credits");
  const studySystem = str(extra, "study_system");
  const systemDescription = str(extra, "system_description");

  const fields = [
    {
      label: "ชื่อปริญญาและสาขาวิชา (ภาษาไทย)",
      value: str(extra, "degree_full_th"),
    },
    {
      label: "ชื่อปริญญาและสาขาวิชา (ภาษาอังกฤษ)",
      value: str(extra, "degree_full_en"),
    },
    {
      label: "ชื่อย่อปริญญา (ภาษาไทย)",
      value: str(extra, "degree_short_th"),
    },
    {
      label: "ชื่อย่อปริญญา (ภาษาอังกฤษ)",
      value: str(extra, "degree_short_en"),
    },
    {
      label: "สถานที่จัดการเรียนการสอน",
      value: str(extra, "location"),
    },
    {
      label: "ภาษาที่ใช้",
      value: str(extra, "language"),
    },
    {
      label: "ระบบการจัดการศึกษา",
      value: systemDescription || studySystem,
    },
  ].filter((f) => f.value);

  const summary: CurriculumProgram["summary"] = [];
  if (years) summary.push({ value: `${years} ปี`, label: "รูปแบบหลักสูตร" });
  if (credits) summary.push({ value: `${credits} หน่วยกิต`, label: "จำนวนหน่วยกิตรวม" });
  if (studySystem) summary.push({ value: studySystem, label: "ระบบการศึกษา" });

  return {
    id: item.id,
    title: str(extra, "program_name_th") || item.title,
    titleEn: str(extra, "program_name_en"),
    body: item.body.trim(),
    pdfUrl: item.imageUrl,
    location: str(extra, "location"),
    language: str(extra, "language"),
    systemDescription: systemDescription || studySystem,
    fields,
    summary,
  };
}
