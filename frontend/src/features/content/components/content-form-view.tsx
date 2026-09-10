"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { ApiError } from "@/lib/api";
import { createContent, getContentDetail, updateContent } from "../api";
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
};

/** บอกคนทั่วไปว่าฟอร์มนี้ไปโผล่ตรงไหนบนเว็บ */
const LOCATION_HINT: Partial<Record<ApiContentType, string>> = {
  curriculum:
    "หน้าแรก → About Us (ข้อความด้านขวา + รูปด้านซ้าย) และหน้าหลักสูตร (/about-us/beng)",
  video: "หน้าแรก → วิดีโอด้านบนสุด",
  staff: "หน้าแรก → ส่วนบุคลากร / คณาจารย์",
  student_work: "หน้าแรก → Student Showcase และหน้า listing /about-us/student-works",
  admissions: "หน้า /about-us/admission-requirements — คุณสมบัติ การดูแลแรกเข้า ค่าเทอม",
  career_path: "หน้า /about-us/careers — อาชีพหลังจบการศึกษา",
  activity: "หน้าแรก → About Us → กล่องกิจกรรม และหน้า listing /about-us/activities",
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

function parseSupportLines(text: string): { title: string; detail: string }[] {
  return parseLines(text).map((line) => {
    const sep = line.indexOf("|");
    if (sep === -1) return { title: line, detail: "" };
    return {
      title: line.slice(0, sep).trim(),
      detail: line.slice(sep + 1).trim(),
    };
  }).filter((row) => row.title);
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
    titleEn: readExtraString(dto.extra, "title_en"),
    quota: readExtraString(dto.extra, "quota"),
    applyUrl: readExtraString(dto.extra, "apply_url"),
    qualificationsText: linesFromExtra(dto.extra, "qualifications"),
    supportText: supportTextFromExtra(dto.extra),
    documentsText: linesFromExtra(dto.extra, "documents"),
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

    const supportItems = parseSupportLines(form.supportText);
    if (supportItems.length > 0) extra.support_items = supportItems;
    else delete extra.support_items;

    const documents = parseLines(form.documentsText);
    if (documents.length > 0) extra.documents = documents;
    else delete extra.documents;
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
  }
  if (type === "curriculum") {
    if (form.aboutImageUrl.trim()) extra.about_image_url = form.aboutImageUrl.trim();
    else delete extra.about_image_url;
    if (form.aboutCaption.trim()) extra.about_image_caption = form.aboutCaption.trim();
    else delete extra.about_image_caption;
  }
  if (type === "activity") {
    if (form.googlePhotosUrl.trim()) extra.google_photos_url = form.googlePhotosUrl.trim();
    else delete extra.google_photos_url;
    if (form.eventDate.trim()) extra.event_date = form.eventDate.trim();
    else delete extra.event_date;
  }

  return Object.keys(extra).length > 0 ? extra : undefined;
}

function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
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

  const heading = mode === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
  const locationHint = LOCATION_HINT[type];

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
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onCancel}
              aria-label="กลับ"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
              <p className="text-sm text-muted-foreground">{sectionTitle}</p>
            </div>
          </div>
        </div>
      </header>

      {locationHint ? (
        <div className="mb-5 flex gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm text-sky-950">
          <MapPin className="mt-0.5 size-4 shrink-0 text-sky-700" />
          <p>
            <span className="font-medium">ตำแหน่งบนเว็บ: </span>
            {locationHint}
          </p>
        </div>
      ) : null}

      {loadingDetail ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          กำลังโหลด...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
          <div className="space-y-2">
            <Label htmlFor="content-title">ชื่อ *</Label>
            <Input
              id="content-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => {
                if (mode === "create" && !form.slug.trim() && form.title.trim()) {
                  updateField("slug", slugify(form.title));
                }
              }}
              placeholder="ชื่อรายการ"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-slug">รหัสลิงก์ (ไม่บังคับ)</Label>
            <Input
              id="content-slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="เช่น curriculum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-body">รายละเอียด</Label>
            <Textarea
              id="content-body"
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              placeholder="เนื้อหา / คำอธิบาย"
            />
          </div>

          {type === "video" ? (
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
          ) : type === "curriculum" ? (
            <>
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
          ) : type === "activity" ? (
            <>
              <FileUploadField
                label="รูปปกกิจกรรม"
                value={form.imageUrl}
                onChange={(url) => updateField("imageUrl", url)}
                kind="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hint="รูปปกที่โชว์ในการ์ดกิจกรรมหน้าแรก"
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
                  placeholder="https://photos.google.com/share/..."
                />
                <p className="text-xs text-muted-foreground">
                  วางลิงก์แชร์อัลบั้ม — นักศึกษาคลิกแล้วไปเอารูปได้เอง
                </p>
              </div>
            </>
          ) : type === "admissions" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="admissions-title-en">ชื่อภาษาอังกฤษ</Label>
                <Input
                  id="admissions-title-en"
                  value={form.titleEn}
                  onChange={(e) => updateField("titleEn", e.target.value)}
                  placeholder="Bachelor of Engineering Program in Computer Engineering"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="content-tuition">ค่าเทอม</Label>
                  <Input
                    id="content-tuition"
                    value={form.tuition}
                    onChange={(e) => updateField("tuition", e.target.value)}
                    placeholder="เช่น 25,000 บาท / เทอม"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-quota">จำนวนรับ</Label>
                  <Input
                    id="content-quota"
                    value={form.quota}
                    onChange={(e) => updateField("quota", e.target.value)}
                    placeholder="เช่น 40 คน / ปี"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apply-url">ลิงก์สมัคร / เว็บรับสมัคร</Label>
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
                  placeholder={
                    "สำเร็จการศึกษาไม่ต่ำกว่ามัธยมศึกษาตอนปลายสายวิทยาศาสตร์-คณิตศาสตร์\nมีผลการเรียนเฉลี่ยสะสมเป็นไปตามเกณฑ์ที่คณะกำหนด"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-items">
                  การดูแลนักศึกษาแรกเข้า (บรรทัดละ 1 รายการ: หัวข้อ | รายละเอียด)
                </Label>
                <Textarea
                  id="support-items"
                  value={form.supportText}
                  onChange={(e) => updateField("supportText", e.target.value)}
                  placeholder={
                    "ปฐมนิเทศนักศึกษาใหม่ | แนะนำหลักสูตร กฎระเบียบ และการใช้ชีวิต\nอาจารย์ที่ปรึกษาประจำ | ดูแลให้คำปรึกษารายบุคคล"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documents">เอกสารที่ต้องใช้ (หนึ่งรายการต่อบรรทัด)</Label>
                <Textarea
                  id="documents"
                  value={form.documentsText}
                  onChange={(e) => updateField("documentsText", e.target.value)}
                  placeholder={"สำเนาบัตรประชาชน\nใบแสดงผลการเรียน"}
                />
              </div>
            </>
          ) : (
            <FileUploadField
              label="รูปภาพ"
              value={form.imageUrl}
              onChange={(url) => updateField("imageUrl", url)}
              kind="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hint="อัปโหลดไป S3 หรือวาง URL เอง"
            />
          )}

          {type === "staff" || type === "career_path" ? (
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
          ) : null}

          {type === "student_work" ? (
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
          ) : null}

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
            <div className="space-y-2">
              <Label htmlFor="content-published">การเผยแพร่</Label>
              <label
                htmlFor="content-published"
                className="flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm"
              >
                <input
                  id="content-published"
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => updateField("isPublished", e.target.checked)}
                  className="size-4 accent-foreground"
                />
                แสดงบนเว็บทันที
              </label>
            </div>
          </div>

          {error ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
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
          </div>
        </form>
      )}
    </div>
  );
}
