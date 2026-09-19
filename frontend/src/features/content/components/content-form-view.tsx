"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdminFormActions,
  AdminFormShell,
  AdminSection,
  AdminSelect,
  AdminStatus,
  AdminTextarea,
  AdminToggle,
  FileUploadField,
  GalleryUploadField,
} from "@/components/admin";
import { ApiError } from "@/lib/api";
import { createContent, getContentDetail, updateContent } from "../api";
import { listCareerClusters, type CareerClusterDto } from "@/features/quiz/api";
import type { ApiContentType, ContentDto, CreateContentInput } from "../types";

export type ContentFormMode = "create" | "edit";

type ContentFormViewProps = {
  mode: ContentFormMode;
  type: ApiContentType;
  sectionTitle: string;
  editId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
};

type FormState = {
  title: string;
  slug: string;
  body: string;
  imageUrl: string;
  sortOrder: string;
  isPublished: boolean;
  position: string;
  youtubeUrl: string;
  tuition: string;
  year: string;
  aboutImageUrl: string;
  aboutCaption: string;
  googlePhotosUrl: string;
  eventDate: string;
  projectUrl: string;
  subtitle: string;
  titleEn: string;
  quota: string;
  applyUrl: string;
  qualificationsText: string;
  supportText: string;
  documentsText: string;
  durationYears: string;
  totalCredits: string;
  studySystem: string;
  systemDescription: string;
  degreeFullTh: string;
  degreeFullEn: string;
  degreeShortTh: string;
  degreeShortEn: string;
  location: string;
  language: string;
  clusterCode: string;
  galleryUrls: string[];
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  body: "",
  imageUrl: "",
  sortOrder: "0",
  isPublished: true,
  position: "",
  youtubeUrl: "",
  tuition: "",
  year: "",
  aboutImageUrl: "",
  aboutCaption: "",
  googlePhotosUrl: "",
  eventDate: "",
  projectUrl: "",
  subtitle: "",
  titleEn: "",
  quota: "",
  applyUrl: "",
  qualificationsText: "",
  supportText: "",
  documentsText: "",
  durationYears: "",
  totalCredits: "",
  studySystem: "",
  systemDescription: "",
  degreeFullTh: "",
  degreeFullEn: "",
  degreeShortTh: "",
  degreeShortEn: "",
  location: "",
  language: "",
  clusterCode: "",
  galleryUrls: [],
};

const ADMISSIONS_MAX = {
  title: 80,
  titleEn: 80,
  body: 200,
  quota: 40,
  tuition: 40,
  lines: 20,
};

/** บอกคนทั่วไปว่าฟอร์มนี้ไปโผล่ตรงไหนบนเว็บ */
const LOCATION_HINT: Partial<Record<ApiContentType, string>> = {
  curriculum:
    "หน้า /about-us/beng เป็น listing กดดูรายละเอียด · รูป About Us ใช้บนหน้าแรก",
  video: "หน้าแรก → วิดีโอด้านบนสุด",
  staff: "หน้าแรก → ส่วนบุคลากร / คณาจารย์",
  student_work: "หน้าแรก → Student Showcase และหน้า listing /about-us/student-works",
  admissions: "หน้า /about-us/admission-requirements — หนึ่งรายการต่อรอบ เช่น TCAS 1 Portfolio, โควตา",
  career_path: "หน้า /about-us/careers — อาชีพหลังจบการศึกษา",
  activity:
    "หน้าแรก → About Us → กล่องกิจกรรม และหน้า /about-us/activities แบบโพสต์รูปหลายใบ",
  page: "หน้าเว็บสาธารณะตามที่กำหนด",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0e00-\u0e7f-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function readExtraString(extra: unknown, key: string): string {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return "";
  const value = (extra as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function asExtraRecord(extra: unknown): Record<string, unknown> {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return {};
  return { ...(extra as Record<string, unknown>) };
}

function linesFromExtra(extra: unknown, key: string): string {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return "";
  const value = (extra as Record<string, unknown>)[key];
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .join("\n");
}

function supportTextFromExtra(extra: unknown): string {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return "";
  const value = (extra as Record<string, unknown>).support_items;
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return "";
      const row = item as Record<string, unknown>;
      const title = typeof row.title === "string" ? row.title.trim() : "";
      const detail = typeof row.detail === "string" ? row.detail.trim() : "";
      if (!title) return "";
      return detail ? `${title} | ${detail}` : title;
    })
    .filter(Boolean)
    .join("\n");
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function stringArrayFromExtra(extra: unknown, key: string): string[] {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return [];
  const value = (extra as Record<string, unknown>)[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function dtoToForm(dto: ContentDto): FormState {
  return {
    title: dto.title ?? "",
    slug: dto.slug ?? "",
    body: dto.body ?? "",
    imageUrl: dto.image_url ?? "",
    sortOrder: String(dto.sort_order ?? 0),
    isPublished: dto.is_published ?? true,
    position: readExtraString(dto.extra, "position") || readExtraString(dto.extra, "role"),
    youtubeUrl: readExtraString(dto.extra, "youtube_url"),
    tuition: readExtraString(dto.extra, "tuition"),
    year: readExtraString(dto.extra, "year"),
    aboutImageUrl: readExtraString(dto.extra, "about_image_url"),
    aboutCaption: readExtraString(dto.extra, "about_image_caption"),
    googlePhotosUrl: readExtraString(dto.extra, "google_photos_url"),
    eventDate: readExtraString(dto.extra, "event_date"),
    projectUrl: readExtraString(dto.extra, "project_url"),
    subtitle: readExtraString(dto.extra, "subtitle") || readExtraString(dto.extra, "category"),
    titleEn:
      readExtraString(dto.extra, "program_name_en") ||
      readExtraString(dto.extra, "title_en"),
    quota: readExtraString(dto.extra, "quota"),
    applyUrl: readExtraString(dto.extra, "apply_url"),
    qualificationsText: linesFromExtra(dto.extra, "qualifications"),
    supportText: supportTextFromExtra(dto.extra),
    documentsText: linesFromExtra(dto.extra, "documents"),
    durationYears: readExtraString(dto.extra, "duration_years"),
    totalCredits: readExtraString(dto.extra, "total_credits"),
    studySystem: readExtraString(dto.extra, "study_system"),
    systemDescription: readExtraString(dto.extra, "system_description"),
    degreeFullTh: readExtraString(dto.extra, "degree_full_th"),
    degreeFullEn: readExtraString(dto.extra, "degree_full_en"),
    degreeShortTh: readExtraString(dto.extra, "degree_short_th"),
    degreeShortEn: readExtraString(dto.extra, "degree_short_en"),
    location: readExtraString(dto.extra, "location"),
    language: readExtraString(dto.extra, "language"),
    clusterCode: readExtraString(dto.extra, "cluster_code"),
    galleryUrls: stringArrayFromExtra(dto.extra, "gallery_urls"),
  };
}

/** รวม extra เดิม (เช่น curriculum) แล้วอัปเดตเฉพาะฟิลด์ของฟอร์ม — ไม่ลบค่าอื่นใน DB */
function buildExtra(
  type: ApiContentType,
  form: FormState,
  baseExtra: Record<string, unknown>
): Record<string, unknown> | undefined {
  const extra: Record<string, unknown> = { ...baseExtra };

  if (type === "staff") {
    if (form.position.trim()) extra.position = form.position.trim();
    else delete extra.position;
  }
  if (type === "video") {
    if (form.youtubeUrl.trim()) extra.youtube_url = form.youtubeUrl.trim();
    else delete extra.youtube_url;
  }
  if (type === "admissions") {
    if (form.titleEn.trim()) extra.title_en = form.titleEn.trim();
    else delete extra.title_en;
    if (form.tuition.trim()) extra.tuition = form.tuition.trim();
    else delete extra.tuition;
    if (form.quota.trim()) extra.quota = form.quota.trim();
    else delete extra.quota;
    if (form.applyUrl.trim()) extra.apply_url = form.applyUrl.trim();
    else delete extra.apply_url;

    const qualifications = parseLines(form.qualificationsText);
    if (qualifications.length > 0) extra.qualifications = qualifications;
    else delete extra.qualifications;

    const documents = parseLines(form.documentsText);
    if (documents.length > 0) extra.documents = documents;
    else delete extra.documents;

    delete extra.support_items;
  }
  if (type === "student_work") {
    if (form.year.trim()) extra.year = form.year.trim();
    else delete extra.year;
    if (form.subtitle.trim()) extra.subtitle = form.subtitle.trim();
    else delete extra.subtitle;
    if (form.projectUrl.trim()) extra.project_url = form.projectUrl.trim();
    else delete extra.project_url;
  }
  if (type === "career_path") {
    if (form.position.trim()) extra.role = form.position.trim();
    else delete extra.role;
    if (form.clusterCode.trim()) extra.cluster_code = form.clusterCode.trim();
    else delete extra.cluster_code;
  }
  if (type === "curriculum") {
    const setStr = (key: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed) extra[key] = trimmed;
      else delete extra[key];
    };
    setStr("program_name_th", form.title);
    setStr("program_name_en", form.titleEn);
    setStr("duration_years", form.durationYears);
    setStr("total_credits", form.totalCredits);
    setStr("study_system", form.studySystem);
    setStr("system_description", form.systemDescription);
    setStr("degree_full_th", form.degreeFullTh);
    setStr("degree_full_en", form.degreeFullEn);
    setStr("degree_short_th", form.degreeShortTh);
    setStr("degree_short_en", form.degreeShortEn);
    setStr("location", form.location);
    setStr("language", form.language);
    setStr("about_image_url", form.aboutImageUrl);
    setStr("about_image_caption", form.aboutCaption);
  }
  if (type === "activity") {
    if (form.googlePhotosUrl.trim()) extra.google_photos_url = form.googlePhotosUrl.trim();
    else delete extra.google_photos_url;
    if (form.eventDate.trim()) extra.event_date = form.eventDate.trim();
    else delete extra.event_date;
    const gallery = form.galleryUrls.map((url) => url.trim()).filter(Boolean);
    if (gallery.length > 0) extra.gallery_urls = gallery;
    else delete extra.gallery_urls;
  }

  return Object.keys(extra).length > 0 ? extra : undefined;
}

function Textarea(props: React.ComponentProps<"textarea">) {
  return <AdminTextarea {...props} />;
}

export function ContentFormView({
  mode,
  type,
  sectionTitle,
  editId,
  onCancel,
  onSuccess,
}: ContentFormViewProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [baseExtra, setBaseExtra] = useState<Record<string, unknown>>({});
  const [loadingDetail, setLoadingDetail] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clusters, setClusters] = useState<CareerClusterDto[]>([]);

  const heading = mode === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
  const locationHint = LOCATION_HINT[type];

  useEffect(() => {
    if (type !== "career_path") return;
    let cancelled = false;
    void listCareerClusters()
      .then((rows) => {
        if (!cancelled) setClusters(rows);
      })
      .catch(() => {
        if (!cancelled) setClusters([]);
      });
    return () => {
      cancelled = true;
    };
  }, [type]);

  useEffect(() => {
    setError(null);

    if (mode === "create") {
      setForm(emptyForm);
      setBaseExtra({});
      setLoadingDetail(false);
      return;
    }

    if (!editId) return;

    let cancelled = false;
    setLoadingDetail(true);
    void getContentDetail(editId)
      .then((dto) => {
        if (!cancelled) {
          setForm(dtoToForm(dto));
          setBaseExtra(asExtraRecord(dto.extra));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "โหลดรายละเอียดไม่สำเร็จ"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, editId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("กรุณากรอกชื่อ");
      return;
    }

    if (type === "admissions") {
      if (title.length > ADMISSIONS_MAX.title) {
        setError(`ชื่อรอบใส่ได้ไม่เกิน ${ADMISSIONS_MAX.title} ตัวอักษร`);
        return;
      }
      if (parseLines(form.qualificationsText).length > ADMISSIONS_MAX.lines) {
        setError(`คุณสมบัติใส่ได้ไม่เกิน ${ADMISSIONS_MAX.lines} ข้อ`);
        return;
      }
      if (parseLines(form.documentsText).length > ADMISSIONS_MAX.lines) {
        setError(`เอกสารใส่ได้ไม่เกิน ${ADMISSIONS_MAX.lines} รายการ`);
        return;
      }
    }

    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const payloadBase = {
      title,
      slug: form.slug.trim() || undefined,
      body: form.body.trim(),
      image_url: form.imageUrl.trim(),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: form.isPublished,
      extra: buildExtra(type, form, baseExtra),
    };

    setSubmitting(true);
    setError(null);
    try {
      if (mode === "create") {
        const input: CreateContentInput = { type, ...payloadBase };
        await createContent(input);
      } else if (editId) {
        await updateContent(editId, payloadBase);
      }
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "บันทึกไม่สำเร็จ"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormShell
      heading={heading}
      sectionTitle={sectionTitle}
      locationHint={locationHint ? `ตำแหน่งบนเว็บ: ${locationHint}` : undefined}
      onBack={onCancel}
    >
      {loadingDetail ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          กำลังโหลด...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
          <AdminSection title="ข้อมูลหลัก" description="ชื่อและรายละเอียดที่จะแสดงบนเว็บ">
          <div className="space-y-2">
            <Label htmlFor="content-title">
              {type === "admissions" ? "ชื่อรอบ *" : "ชื่อ *"}
            </Label>
            <Input
              id="content-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => {
                if (mode === "create" && !form.slug.trim() && form.title.trim()) {
                  updateField("slug", slugify(form.title));
                }
              }}
              placeholder={
                type === "admissions" ? "เช่น TCAS 1 Portfolio" : "ชื่อรายการ"
              }
              maxLength={type === "admissions" ? ADMISSIONS_MAX.title : undefined}
              required
              autoFocus
            />
            {type === "admissions" ? (
              <p className="text-xs text-muted-foreground">
                แสดงเป็นหัวข้อบนหน้าคุณสมบัติ — หนึ่งรายการต่อหนึ่งรอบ เช่น TCAS 1,
                โควตา, รับตรง (ไม่เกิน {ADMISSIONS_MAX.title} ตัวอักษร)
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-slug">รหัสลิงก์ (ไม่บังคับ)</Label>
            <Input
              id="content-slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder={type === "admissions" ? "เช่น tcas-1-portfolio" : "เช่น curriculum"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-body">
              {type === "admissions"
                ? "หมายเหตุรอบ (ไม่บังคับ)"
                : type === "activity"
                  ? "คำบรรยายโพสต์"
                  : "รายละเอียด"}
            </Label>
            <Textarea
              id="content-body"
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              placeholder={
                type === "admissions"
                  ? "เช่น ปีการศึกษาที่เปิดรับ (รุ่น 2568)"
                  : type === "activity"
                    ? "เช่น ภาพบรรยากาศ Workshop Network Infrastructure\n#CE #KMITLPCC"
                    : "เนื้อหา / คำอธิบาย"
              }
              maxLength={type === "admissions" ? ADMISSIONS_MAX.body : undefined}
            />
            {type === "admissions" ? (
              <p className="text-xs text-muted-foreground">
                ข้อความสั้นใต้หัวข้อรอบ ไม่ใช่รายการคุณสมบัติ (ไม่เกิน {ADMISSIONS_MAX.body} ตัวอักษร)
              </p>
            ) : type === "activity" ? (
              <p className="text-xs text-muted-foreground">
                ข้อความใต้ชื่อกิจกรรม — ใส่แฮชแท็กและลิงก์ได้ ขึ้นบรรทัดใหม่ได้
              </p>
            ) : null}
          </div>
          </AdminSection>

          {type === "video" ? (
            <AdminSection title="สื่อหน้าแรก" description="วิดีโอ รูป หรือลิงก์ YouTube">
            <>
              <FileUploadField
                label="วิดีโอหรือรูปหน้าแรก"
                value={form.imageUrl}
                onChange={(url) => updateField("imageUrl", url)}
                kind="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                hint="อัปโหลดสูงสุด 500MB — จะแสดงด้านบนสุดของหน้าแรก"
              />
              <div className="space-y-2">
                <Label htmlFor="content-youtube">ลิงก์ YouTube (ถ้าไม่มีไฟล์)</Label>
                <Input
                  id="content-youtube"
                  value={form.youtubeUrl}
                  onChange={(e) => updateField("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </>
            </AdminSection>
          ) : type === "curriculum" ? (
            <AdminSection title="รายละเอียดหลักสูตร">
            <>
              <div className="space-y-2">
                <Label htmlFor="curriculum-title-en">ชื่อหลักสูตรภาษาอังกฤษ</Label>
                <Input
                  id="curriculum-title-en"
                  value={form.titleEn}
                  onChange={(e) => updateField("titleEn", e.target.value)}
                  placeholder="Bachelor of Engineering Program in Computer Engineering"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration-years">ระยะเวลา (ปี)</Label>
                  <Input
                    id="duration-years"
                    value={form.durationYears}
                    onChange={(e) => updateField("durationYears", e.target.value)}
                    placeholder="เช่น 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-credits">หน่วยกิตรวม</Label>
                  <Input
                    id="total-credits"
                    value={form.totalCredits}
                    onChange={(e) => updateField("totalCredits", e.target.value)}
                    placeholder="เช่น 133"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study-system">ระบบการศึกษา</Label>
                  <Input
                    id="study-system"
                    value={form.studySystem}
                    onChange={(e) => updateField("studySystem", e.target.value)}
                    placeholder="เช่น ทวิภาค"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-description">ระบบการจัดการศึกษา</Label>
                <Textarea
                  id="system-description"
                  value={form.systemDescription}
                  onChange={(e) => updateField("systemDescription", e.target.value)}
                  placeholder="อธิบายระบบการเรียน เช่น ภาคการศึกษาละ 16 สัปดาห์"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree-full-th">ชื่อปริญญาและสาขาวิชา (ภาษาไทย)</Label>
                <Input
                  id="degree-full-th"
                  value={form.degreeFullTh}
                  onChange={(e) => updateField("degreeFullTh", e.target.value)}
                  placeholder="วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree-full-en">ชื่อปริญญาและสาขาวิชา (ภาษาอังกฤษ)</Label>
                <Input
                  id="degree-full-en"
                  value={form.degreeFullEn}
                  onChange={(e) => updateField("degreeFullEn", e.target.value)}
                  placeholder="Bachelor of Engineering (Computer Engineering)"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="degree-short-th">ชื่อย่อปริญญา (ภาษาไทย)</Label>
                  <Input
                    id="degree-short-th"
                    value={form.degreeShortTh}
                    onChange={(e) => updateField("degreeShortTh", e.target.value)}
                    placeholder="วศ.บ. (วิศวกรรมคอมพิวเตอร์)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree-short-en">ชื่อย่อปริญญา (ภาษาอังกฤษ)</Label>
                  <Input
                    id="degree-short-en"
                    value={form.degreeShortEn}
                    onChange={(e) => updateField("degreeShortEn", e.target.value)}
                    placeholder="B.Eng. (Computer Engineering)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="curriculum-location">สถานที่จัดการเรียนการสอน</Label>
                <Input
                  id="curriculum-location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="วิทยาเขตชุมพรเขตรอุดมศักดิ์"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="curriculum-language">ภาษาที่ใช้</Label>
                <Input
                  id="curriculum-language"
                  value={form.language}
                  onChange={(e) => updateField("language", e.target.value)}
                  placeholder="ไทย / อังกฤษ"
                />
              </div>
              <FileUploadField
                label="รูป About Us (ด้านซ้ายหน้าแรก)"
                value={form.aboutImageUrl}
                onChange={(url) => updateField("aboutImageUrl", url)}
                kind="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hint="รูปกิจกรรม/นักศึกษา — แสดงซ้ายมือในส่วน About Us"
              />
              <div className="space-y-2">
                <Label htmlFor="about-caption">คำอธิบายรูป (ปุ่ม +)</Label>
                <Textarea
                  id="about-caption"
                  value={form.aboutCaption}
                  onChange={(e) => updateField("aboutCaption", e.target.value)}
                  placeholder="ข้อความสั้น ๆ เมื่อผู้เข้าชมกดปุ่ม + บนรูป"
                />
              </div>
              <FileUploadField
                label="ไฟล์ PDF หลักสูตร"
                value={form.imageUrl}
                onChange={(url) => updateField("imageUrl", url)}
                kind="pdf"
                accept="application/pdf"
                hint="ไฟล์เอกสารหลักสูตรสำหรับหน้า /about-us/beng (ไม่ใช่รูป About Us)"
              />
            </>
            </AdminSection>
          ) : type === "activity" ? (
            <AdminSection title="สื่อกิจกรรม">
            <>
              <FileUploadField
                label="รูปปกกิจกรรม"
                value={form.imageUrl}
                onChange={(url) => updateField("imageUrl", url)}
                kind="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hint="รูปแรกในกริด และรูปย่อบนหน้าแรก"
              />
              <GalleryUploadField
                label="รูปเพิ่มในกริด"
                values={form.galleryUrls}
                onChange={(urls) => updateField("galleryUrls", urls)}
                hint="อัปโหลดหลายรูปได้ — หน้ากิจกรรมโชว์กริด 3×2 กดรูปแล้วเลื่อนดูทีละใบ"
              />
              <div className="space-y-2">
                <Label htmlFor="activity-date">ช่วงเวลา / วันที่</Label>
                <Input
                  id="activity-date"
                  value={form.eventDate}
                  onChange={(e) => updateField("eventDate", e.target.value)}
                  placeholder="เช่น สิงหาคม 2569"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-photos">ลิงก์ Google Photos</Label>
                <Input
                  id="google-photos"
                  value={form.googlePhotosUrl}
                  onChange={(e) => updateField("googlePhotosUrl", e.target.value)}
                  placeholder="https://photos.app.goo.gl/..."
                />
                <p className="text-xs text-muted-foreground">
                  วางลิงก์แชร์อัลบั้ม — กดกริดรูปหรือลิงก์แล้วไปดูรูปทั้งหมด
                </p>
              </div>
            </>
            </AdminSection>
          ) : type === "admissions" ? (
            <AdminSection title="รายละเอียดรอบรับสมัคร">
            <>
              <div className="space-y-2">
                <Label htmlFor="admissions-title-en">ชื่อรอง / ภาษาอังกฤษ (ไม่บังคับ)</Label>
                <Input
                  id="admissions-title-en"
                  value={form.titleEn}
                  onChange={(e) => updateField("titleEn", e.target.value)}
                  placeholder="เช่น TCAS 1 Portfolio"
                  maxLength={ADMISSIONS_MAX.titleEn}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="content-quota">จำนวนรับ</Label>
                  <Input
                    id="content-quota"
                    value={form.quota}
                    onChange={(e) => updateField("quota", e.target.value)}
                    placeholder="เช่น 40 คน"
                    maxLength={ADMISSIONS_MAX.quota}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-tuition">ค่าเทอม</Label>
                  <Input
                    id="content-tuition"
                    value={form.tuition}
                    onChange={(e) => updateField("tuition", e.target.value)}
                    placeholder="เช่น 25,000 บาท / เทอม"
                    maxLength={ADMISSIONS_MAX.tuition}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apply-url">ลิงก์สมัครของรอบนี้ (ไม่บังคับ)</Label>
                <Input
                  id="apply-url"
                  value={form.applyUrl}
                  onChange={(e) => updateField("applyUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">คุณสมบัติผู้เข้าศึกษา (หนึ่งข้อต่อบรรทัด)</Label>
                <Textarea
                  id="qualifications"
                  value={form.qualificationsText}
                  onChange={(e) => updateField("qualificationsText", e.target.value)}
                  placeholder={"GPAX ขั้นต่ำ\nคะแนน TGAT/TPAT\nเกณฑ์ Portfolio"}
                />
                <p className="text-xs text-muted-foreground">
                  {parseLines(form.qualificationsText).length}/{ADMISSIONS_MAX.lines} ข้อ —
                  ขึ้นบรรทัดใหม่ = 1 ข้อ
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documents">เอกสารที่ต้องใช้ (หนึ่งรายการต่อบรรทัด)</Label>
                <Textarea
                  id="documents"
                  value={form.documentsText}
                  onChange={(e) => updateField("documentsText", e.target.value)}
                  placeholder={"สำเนาบัตรประชาชน\nใบแสดงผลการเรียน"}
                />
                <p className="text-xs text-muted-foreground">
                  {parseLines(form.documentsText).length}/{ADMISSIONS_MAX.lines} รายการ —
                  ขึ้นบรรทัดใหม่ = 1 รายการ
                </p>
              </div>
            </>
            </AdminSection>
          ) : (
            <AdminSection title="รูปภาพ">
            <FileUploadField
              label="รูปภาพ"
              value={form.imageUrl}
              onChange={(url) => updateField("imageUrl", url)}
              kind="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hint="อัปโหลดไป S3 หรือวาง URL เอง"
            />
            </AdminSection>
          )}

          {type === "staff" || type === "career_path" ? (
            <AdminSection title={type === "staff" ? "ข้อมูลบุคลากร" : "ข้อมูลอาชีพ"}>
            <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-position">
                {type === "staff" ? "ตำแหน่ง" : "บทบาท / อาชีพ"}
              </Label>
              <Input
                id="content-position"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder={
                  type === "staff" ? "เช่น อาจารย์ประจำ" : "เช่น Software Engineer"
                }
              />
            </div>
          {type === "career_path" ? (
            <div className="space-y-2">
              <Label htmlFor="content-cluster">กลุ่มสายงาน</Label>
              <AdminSelect
                id="content-cluster"
                value={form.clusterCode}
                onChange={(e) => updateField("clusterCode", e.target.value)}
              >
                <option value="">ยังไม่ระบุกลุ่ม</option>
                {clusters.map((cluster) => (
                  <option key={cluster.code} value={cluster.code}>
                    {cluster.name}
                  </option>
                ))}
              </AdminSelect>
              <p className="text-xs text-muted-foreground">
                ใช้ผูกอาชีพนี้กับผลควิซแนะนำสาย เช่น ได้กลุ่มสร้างซอฟต์แวร์แล้วโชว์อาชีพในกลุ่มนี้
              </p>
            </div>
          ) : null}
            </div>
            </AdminSection>
          ) : null}

          {type === "student_work" ? (
            <AdminSection title="รายละเอียดผลงาน">
            <>
              <div className="space-y-2">
                <Label htmlFor="content-subtitle">หมวด / ประเภทผลงาน</Label>
                <Input
                  id="content-subtitle"
                  value={form.subtitle}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  placeholder="เช่น โครงงานปี 4, Hardware, NETBOX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-year">ปีการศึกษา</Label>
                <Input
                  id="content-year"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  placeholder="เช่น 2568"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-project-url">ลิงก์เข้าใช้งานผลงาน</Label>
                <Input
                  id="content-project-url"
                  value={form.projectUrl}
                  onChange={(e) => updateField("projectUrl", e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  ลิงก์เว็บ demo / โปรเจกต์ ให้ผู้เข้าชมกดเข้าไปใช้งานได้จากหน้า listing
                </p>
              </div>
            </>
            </AdminSection>
          ) : null}

          <AdminSection title="การเผยแพร่">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-sort">ลำดับการแสดง</Label>
              <Input
                id="content-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
              />
            </div>
            <AdminToggle
              id="content-published"
              checked={form.isPublished}
              onChange={(checked) => updateField("isPublished", checked)}
              label="แสดงบนเว็บทันที"
            />
          </div>
          </AdminSection>

          {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

          <AdminFormActions>
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : mode === "create" ? (
                "บันทึก"
              ) : (
                "บันทึกการแก้ไข"
              )}
            </Button>
          </AdminFormActions>
        </form>
      )}
    </AdminFormShell>
  );
}
