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
import {
  STUDENT_WORK_CATEGORIES,
  normalizeStudentWorkCategory,
} from "@/features/about-us/student-works/types";
import {
  sectionFromExtraValue,
  sectionToExtraValue,
  type AdmissionSectionContent,
} from "@/features/about-us/admissions/types";
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
  googlePhotosUrl: string;
  eventDate: string;
  projectUrl: string;
  subtitle: string;
  titleEn: string;
  quota: string;
  applyUrl: string;
  qualificationsIntro: string;
  qualificationsHeading: string;
  qualificationsItems: string;
  supportText: string;
  documentsIntro: string;
  documentsHeading: string;
  documentsItems: string;
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
  manual: string;
  manualUrl: string;
  salary: string;
  salaryJunior: string;
  salaryMid: string;
  salarySenior: string;
  skills: string;
  outlook: string;
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
  googlePhotosUrl: "",
  eventDate: "",
  projectUrl: "",
  subtitle: "",
  titleEn: "",
  quota: "",
  applyUrl: "",
  qualificationsIntro: "",
  qualificationsHeading: "",
  qualificationsItems: "",
  supportText: "",
  documentsIntro: "",
  documentsHeading: "",
  documentsItems: "",
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
  manual: "",
  manualUrl: "",
  salary: "",
  salaryJunior: "",
  salaryMid: "",
  salarySenior: "",
  skills: "",
  outlook: "",
};

const ADMISSIONS_MAX = {
  title: 80,
  titleEn: 80,
  body: 200,
  quota: 40,
  tuition: 40,
  /** ความยาวข้อความคุณสมบัติ / เอกสาร */
  content: 4000,
};

/** บอกคนทั่วไปว่าฟอร์มนี้ไปโผล่ตรงไหนบนเว็บ */
const LOCATION_HINT: Partial<Record<ApiContentType, string>> = {
  curriculum:
    "หน้า /about-us/beng เป็น listing กดดูรายละเอียด · รูป About Us ใช้บนหน้าแรก",
  video: "หน้าแรก → วิดีโอด้านบนสุด",
  staff: "หน้าแรก → ส่วนบุคลากร / คณาจารย์",
  student_work:
    "หน้าแรก → Student Showcase และหน้า listing /about-us/student-works",
  admissions:
    "หน้า /about-us/admission-requirements — หนึ่งรายการต่อรอบ เช่น TCAS 1 Portfolio, โควตา",
  career_path:
    "หน้า /about-us/careers — กดการ์ดแล้วขึ้น popup (ฐานเงินเดือน / ทักษะ / โอกาสเติบโต)",
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
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

function asExtraRecord(extra: unknown): Record<string, unknown> {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return {};
  return { ...(extra as Record<string, unknown>) };
}

function sectionFieldsFromExtra(
  extra: unknown,
  key: string,
): { intro: string; heading: string; items: string } {
  const section = sectionFromExtraValue(
    extra && typeof extra === "object" && !Array.isArray(extra)
      ? (extra as Record<string, unknown>)[key]
      : undefined,
  );
  return {
    intro: section.intro,
    heading: section.heading,
    items: section.items.join("\n"),
  };
}

function formSection(
  intro: string,
  heading: string,
  itemsText: string,
): AdmissionSectionContent {
  return {
    intro,
    heading,
    items: itemsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  };
}

function sectionCharCount(section: AdmissionSectionContent): number {
  return (
    section.intro.length +
    section.heading.length +
    section.items.join("\n").length
  );
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
    position:
      readExtraString(dto.extra, "position") ||
      readExtraString(dto.extra, "role"),
    youtubeUrl: readExtraString(dto.extra, "youtube_url"),
    tuition: readExtraString(dto.extra, "tuition"),
    year: readExtraString(dto.extra, "year"),
    aboutImageUrl: readExtraString(dto.extra, "about_image_url"),
    googlePhotosUrl: readExtraString(dto.extra, "google_photos_url"),
    eventDate: readExtraString(dto.extra, "event_date"),
    projectUrl: readExtraString(dto.extra, "project_url"),
    subtitle:
      readExtraString(dto.extra, "subtitle") ||
      readExtraString(dto.extra, "category"),
    titleEn:
      readExtraString(dto.extra, "program_name_en") ||
      readExtraString(dto.extra, "title_en"),
    quota: readExtraString(dto.extra, "quota"),
    applyUrl: readExtraString(dto.extra, "apply_url"),
    ...(() => {
      const qualifications = sectionFieldsFromExtra(dto.extra, "qualifications");
      const documents = sectionFieldsFromExtra(dto.extra, "documents");
      return {
        qualificationsIntro: qualifications.intro,
        qualificationsHeading: qualifications.heading,
        qualificationsItems: qualifications.items,
        documentsIntro: documents.intro,
        documentsHeading: documents.heading,
        documentsItems: documents.items,
      };
    })(),
    supportText: supportTextFromExtra(dto.extra),
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
    manual:
      readExtraString(dto.extra, "manual") ||
      readExtraString(dto.extra, "user_manual"),
    manualUrl:
      readExtraString(dto.extra, "manual_url") ||
      readExtraString(dto.extra, "user_manual_url"),
    salary:
      readExtraString(dto.extra, "salary") ||
      readExtraString(dto.extra, "salary_range"),
    salaryJunior:
      readExtraString(dto.extra, "salary_junior") ||
      readExtraString(dto.extra, "salary_entry"),
    salaryMid:
      readExtraString(dto.extra, "salary_mid") ||
      readExtraString(dto.extra, "salary_middle"),
    salarySenior: readExtraString(dto.extra, "salary_senior"),
    skills: readExtraString(dto.extra, "skills"),
    outlook:
      readExtraString(dto.extra, "outlook") ||
      readExtraString(dto.extra, "growth"),
  };
}

/** รวม extra เดิม (เช่น curriculum) แล้วอัปเดตเฉพาะฟิลด์ของฟอร์ม — ไม่ลบค่าอื่นใน DB */
function buildExtra(
  type: ApiContentType,
  form: FormState,
  baseExtra: Record<string, unknown>,
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

    // เกริ่นนำ / หัวข้อ / รายการ (หนึ่งบรรทัดต่อข้อ ไม่ต้องใส่ -)
    const qualifications = formSection(
      form.qualificationsIntro,
      form.qualificationsHeading,
      form.qualificationsItems,
    );
    const qualificationsExtra = sectionToExtraValue(qualifications);
    if (qualificationsExtra) extra.qualifications = qualificationsExtra;
    else delete extra.qualifications;

    const documents = formSection(
      form.documentsIntro,
      form.documentsHeading,
      form.documentsItems,
    );
    const documentsExtra = sectionToExtraValue(documents);
    if (documentsExtra) extra.documents = documentsExtra;
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
    const gallery = form.galleryUrls.map((url) => url.trim()).filter(Boolean);
    if (gallery.length > 0) extra.gallery_urls = gallery;
    else delete extra.gallery_urls;
    if (form.manual.trim()) extra.manual = form.manual.trim();
    else delete extra.manual;
    if (form.manualUrl.trim()) extra.manual_url = form.manualUrl.trim();
    else delete extra.manual_url;
  }
  if (type === "career_path") {
    if (form.position.trim()) extra.role = form.position.trim();
    else delete extra.role;
    if (form.clusterCode.trim()) extra.cluster_code = form.clusterCode.trim();
    else delete extra.cluster_code;
    if (form.salaryJunior.trim()) extra.salary_junior = form.salaryJunior.trim();
    else delete extra.salary_junior;
    if (form.salaryMid.trim()) extra.salary_mid = form.salaryMid.trim();
    else delete extra.salary_mid;
    if (form.salarySenior.trim()) extra.salary_senior = form.salarySenior.trim();
    else delete extra.salary_senior;
    // เก็บค่าเดี่ยวเก่าไว้เฉพาะเมื่อยังไม่กรอกแยกระดับ
    if (
      !form.salaryJunior.trim() &&
      !form.salaryMid.trim() &&
      !form.salarySenior.trim() &&
      form.salary.trim()
    ) {
      extra.salary = form.salary.trim();
    } else {
      delete extra.salary;
    }
    if (form.skills.trim()) extra.skills = form.skills.trim();
    else delete extra.skills;
    if (form.outlook.trim()) extra.outlook = form.outlook.trim();
    else delete extra.outlook;
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
    delete extra.about_image_caption;
  }
  if (type === "activity") {
    if (form.googlePhotosUrl.trim())
      extra.google_photos_url = form.googlePhotosUrl.trim();
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
      setForm({
        ...emptyForm,
        subtitle: type === "student_work" ? "Software" : "",
      });
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
          const next = dtoToForm(dto);
          if (type === "student_work") {
            const normalized = normalizeStudentWorkCategory(
              next.subtitle || "Software",
            );
            next.subtitle = (
              STUDENT_WORK_CATEGORIES as readonly string[]
            ).includes(normalized)
              ? normalized
              : "Other";
          }
          setForm(next);
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
                : "โหลดรายละเอียดไม่สำเร็จ",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, editId, type]);

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
      if (
        sectionCharCount(
          formSection(
            form.qualificationsIntro,
            form.qualificationsHeading,
            form.qualificationsItems,
          ),
        ) > ADMISSIONS_MAX.content
      ) {
        setError(`คุณสมบัติใส่ได้ไม่เกิน ${ADMISSIONS_MAX.content} ตัวอักษร`);
        return;
      }
      if (
        sectionCharCount(
          formSection(
            form.documentsIntro,
            form.documentsHeading,
            form.documentsItems,
          ),
        ) > ADMISSIONS_MAX.content
      ) {
        setError(`เอกสารใส่ได้ไม่เกิน ${ADMISSIONS_MAX.content} ตัวอักษร`);
        return;
      }
    }

    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const slug = form.slug.trim() || (mode === "create" ? slugify(title) : "");
    const payloadBase = {
      title,
      slug: slug || undefined,
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
            : "บันทึกไม่สำเร็จ",
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <AdminSection
            title="ข้อมูลหลัก"
            description="ชื่อและรายละเอียดที่จะแสดงบนเว็บ"
          >
            <div className="space-y-2">
              <Label htmlFor="content-title">
                {type === "admissions" ? "ชื่อรอบ *" : "ชื่อ *"}
              </Label>
              <Input
                id="content-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                onBlur={() => {
                  if (
                    mode === "create" &&
                    !form.slug.trim() &&
                    form.title.trim()
                  ) {
                    updateField("slug", slugify(form.title));
                  }
                }}
                placeholder={
                  type === "admissions" ? "เช่น TCAS 1 Portfolio" : "ชื่อรายการ"
                }
                maxLength={
                  type === "admissions" ? ADMISSIONS_MAX.title : undefined
                }
                required
                autoFocus
              />
              {type === "admissions" ? (
                <p className="text-xs text-muted-foreground">
                  แสดงเป็นหัวข้อบนหน้าคุณสมบัติ — หนึ่งรายการต่อหนึ่งรอบ เช่น
                  TCAS 1, โควตา, รับตรง (ไม่เกิน {ADMISSIONS_MAX.title}{" "}
                  ตัวอักษร)
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-body">
                {type === "admissions"
                  ? "หมายเหตุรอบ (ไม่บังคับ)"
                  : type === "activity"
                    ? "คำบรรยายโพสต์"
                    : type === "student_work"
                      ? "คำอธิบายสั้น (บนการ์ด)"
                      : type === "career_path"
                        ? "คำอธิบายสั้น (บนการ์ด)"
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
                      : type === "student_work"
                        ? "เช่น เป็นระบบสื่อสารข้อมูลภายในมหาวิทยาลัย"
                        : type === "career_path"
                          ? "เช่น ออกแบบ พัฒนา และดูแลระบบซอฟต์แวร์ให้ทำงานได้จริง"
                          : "เนื้อหา / คำอธิบาย"
                }
                maxLength={
                  type === "admissions" ? ADMISSIONS_MAX.body : undefined
                }
              />
              {type === "admissions" ? (
                <p className="text-xs text-muted-foreground">
                  ข้อความสั้นใต้หัวข้อรอบ ไม่ใช่รายการคุณสมบัติ (ไม่เกิน{" "}
                  {ADMISSIONS_MAX.body} ตัวอักษร)
                </p>
              ) : type === "activity" ? (
                <p className="text-xs text-muted-foreground">
                  ข้อความใต้ชื่อกิจกรรม — ใส่แฮชแท็กและลิงก์ได้
                  ขึ้นบรรทัดใหม่ได้
                </p>
              ) : type === "student_work" ? (
                <p className="text-xs text-muted-foreground">
                  ข้อความสั้นบนการ์ด — คู่มือยาวๆ ใส่ในส่วน &quot;คู่มือ /
                  เนื้อหาเพิ่มเติม&quot; ด้านล่าง
                </p>
              ) : type === "career_path" ? (
                <p className="text-xs text-muted-foreground">
                  ข้อความบนการ์ด — ฐานเงินเดือน/ทักษะ ใส่ในส่วน popup ด้านล่าง
                </p>
              ) : null}
            </div>
          </AdminSection>

          {type === "video" ? (
            <AdminSection
              title="สื่อหน้าแรก"
              description="วิดีโอ รูป หรือลิงก์ YouTube"
            >
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
                  <Label htmlFor="content-youtube">
                    ลิงก์ YouTube (ถ้าไม่มีไฟล์)
                  </Label>
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
            <>
              <AdminSection
                title="โครงสร้างการเรียน"
                description="ตัวเลขและระบบที่แสดงบนหน้าหลักสูตร"
              >
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              </AdminSection>

              <AdminSection
                title="ชื่อปริญญา"
                description="ชื่อเต็มและชื่อย่อ ทั้งภาษาไทยและภาษาอังกฤษ"
              >
                <div className="grid gap-4 lg:grid-cols-2">
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
              </AdminSection>

              <AdminSection
                title="สื่อบนเว็บ"
                description="รูปหน้าแรกอยู่ด้านบน ไฟล์หลักสูตรอยู่แถบด้านล่าง"
              >
                <FileUploadField
                  label="รูป About Us (ด้านซ้ายหน้าแรก)"
                  value={form.aboutImageUrl}
                  onChange={(url) => updateField("aboutImageUrl", url)}
                  kind="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hint="แสดงซ้ายมือในส่วน About Us บนหน้าแรก"
                />
                <FileUploadField
                  label="ไฟล์ PDF หลักสูตร"
                  value={form.imageUrl}
                  onChange={(url) => updateField("imageUrl", url)}
                  kind="pdf"
                  accept="application/pdf"
                  hint="เอกสารสำหรับหน้า /about-us/beng"
                />
              </AdminSection>
            </>
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
                    onChange={(e) =>
                      updateField("googlePhotosUrl", e.target.value)
                    }
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
                  <Label htmlFor="admissions-title-en">
                    ชื่อรอง / ภาษาอังกฤษ (ไม่บังคับ)
                  </Label>
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
                  <Label htmlFor="apply-url">
                    ลิงก์สมัครของรอบนี้ (ไม่บังคับ)
                  </Label>
                  <Input
                    id="apply-url"
                    value={form.applyUrl}
                    onChange={(e) => updateField("applyUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">คุณสมบัติผู้เข้าศึกษา</p>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications-intro">เกริ่นนำ</Label>
                    <Textarea
                      id="qualifications-intro"
                      value={form.qualificationsIntro}
                      onChange={(e) =>
                        updateField("qualificationsIntro", e.target.value)
                      }
                      rows={3}
                      placeholder="เช่น ผู้สมัครต้องมีผลการเรียนเฉลี่ยสะสม (GPAX) ไม่ต่ำกว่า 2.50 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications-heading">หัวข้อย่อย</Label>
                    <Input
                      id="qualifications-heading"
                      value={form.qualificationsHeading}
                      onChange={(e) =>
                        updateField("qualificationsHeading", e.target.value)
                      }
                      placeholder="เช่น Portfolio ควรประกอบด้วยข้อมูลดังต่อไปนี้"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications-items">
                      รายการ (หนึ่งข้อต่อบรรทัด)
                    </Label>
                    <Textarea
                      id="qualifications-items"
                      value={form.qualificationsItems}
                      onChange={(e) =>
                        updateField("qualificationsItems", e.target.value)
                      }
                      rows={6}
                      placeholder={[
                        "ประวัติส่วนตัวและประวัติการศึกษา",
                        "เหตุผลหรือแรงบันดาลใจในการเข้าศึกษา",
                        "ผลงานด้านคอมพิวเตอร์หรือเทคโนโลยี",
                      ].join("\n")}
                    />
                    <p className="text-xs text-muted-foreground">
                      ไม่ต้องพิมพ์เครื่องหมาย - ระบบใส่จุดให้อัตโนมัติ
                    </p>
                  </div>
                </div>
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">เอกสารที่ต้องใช้</p>
                  <div className="space-y-2">
                    <Label htmlFor="documents-intro">เกริ่นนำ</Label>
                    <Textarea
                      id="documents-intro"
                      value={form.documentsIntro}
                      onChange={(e) =>
                        updateField("documentsIntro", e.target.value)
                      }
                      rows={3}
                      placeholder="เช่น ผู้สมัครต้องจัดเตรียมเอกสารดังต่อไปนี้"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documents-heading">หัวข้อย่อย</Label>
                    <Input
                      id="documents-heading"
                      value={form.documentsHeading}
                      onChange={(e) =>
                        updateField("documentsHeading", e.target.value)
                      }
                      placeholder="เช่น เอกสารประกอบการสมัคร"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documents-items">
                      รายการ (หนึ่งข้อต่อบรรทัด)
                    </Label>
                    <Textarea
                      id="documents-items"
                      value={form.documentsItems}
                      onChange={(e) =>
                        updateField("documentsItems", e.target.value)
                      }
                      rows={6}
                      placeholder={[
                        "สำเนาบัตรประชาชน",
                        "ใบแสดงผลการเรียน (ปพ.1)",
                        "Portfolio",
                      ].join("\n")}
                    />
                    <p className="text-xs text-muted-foreground">
                      ไม่ต้องพิมพ์เครื่องหมาย - ระบบใส่จุดให้อัตโนมัติ
                    </p>
                  </div>
                </div>
              </>
            </AdminSection>
          ) : type === "student_work" ? (
            <AdminSection
              title="รูปผลงาน"
              description="สูงสุด 4 รูป — รูปปก 1 ใบ + รูปเพิ่มได้อีก 3 ใบ แสดงเป็นรูปใหญ่พร้อมแถบ thumbnail"
            >
              <>
                <FileUploadField
                  label="รูปปก (รูปหลัก)"
                  value={form.imageUrl}
                  onChange={(url) => updateField("imageUrl", url)}
                  kind="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hint="รูปแรกที่แสดง และรูปย่อบนหน้าแรก (Student Showcase)"
                />
                <GalleryUploadField
                  label="รูปเพิ่ม (thumbnail)"
                  values={form.galleryUrls}
                  onChange={(urls) => updateField("galleryUrls", urls)}
                  max={3}
                  hint="กด + เพื่ออัปโหลดรูปเพิ่ม — รวมกับรูปปกสูงสุด 4 รูป"
                />
              </>
            </AdminSection>
          ) : type === "career_path" ? null : (
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

          {type === "staff" ? (
            <AdminSection title="ข้อมูลบุคลากร">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content-position">ตำแหน่ง</Label>
                  <Input
                    id="content-position"
                    value={form.position}
                    onChange={(e) => updateField("position", e.target.value)}
                    placeholder="เช่น อาจารย์ประจำ"
                  />
                </div>
              </div>
            </AdminSection>
          ) : null}

          {type === "career_path" ? (
            <>
              <AdminSection
                title="ข้อมูลอาชีพ"
                description="แสดงบนการ์ดหน้า /about-us/careers"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-position">บทบาท / อาชีพ</Label>
                    <Input
                      id="content-position"
                      value={form.position}
                      onChange={(e) => updateField("position", e.target.value)}
                      placeholder="เช่น Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content-cluster">กลุ่มสายงาน</Label>
                    <AdminSelect
                      id="content-cluster"
                      value={form.clusterCode}
                      onChange={(e) =>
                        updateField("clusterCode", e.target.value)
                      }
                    >
                      <option value="">ยังไม่ระบุกลุ่ม</option>
                      {clusters.map((cluster) => (
                        <option key={cluster.code} value={cluster.code}>
                          {cluster.name_en?.trim()
                            ? `${cluster.name_en} (${cluster.name})`
                            : cluster.name}
                        </option>
                      ))}
                    </AdminSelect>
                    <p className="text-xs text-muted-foreground">
                      ใช้แยกหมวดบนหน้า careers และผูกกับผลควิซแนะนำสาย
                    </p>
                  </div>
                </div>
              </AdminSection>

              <AdminSection
                title="รายละเอียดใน Popup"
                description="แสดงเมื่อผู้เข้าชมกดการ์ดอาชีพ"
              >
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label>ฐานเงินเดือนตามระดับ</Label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        แยกตามตำแหน่ง seniority ซึ่งสัมพันธ์กับประสบการณ์โดยประมาณ
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="career-salary-junior">
                          Junior (0–2 ปี)
                        </Label>
                        <Input
                          id="career-salary-junior"
                          value={form.salaryJunior}
                          onChange={(e) =>
                            updateField("salaryJunior", e.target.value)
                          }
                          placeholder="เช่น 20,000 – 30,000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="career-salary-mid">
                          Mid (3–5 ปี)
                        </Label>
                        <Input
                          id="career-salary-mid"
                          value={form.salaryMid}
                          onChange={(e) =>
                            updateField("salaryMid", e.target.value)
                          }
                          placeholder="เช่น 30,000 – 50,000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="career-salary-senior">
                          Senior (5 ปีขึ้นไป)
                        </Label>
                        <Input
                          id="career-salary-senior"
                          value={form.salarySenior}
                          onChange={(e) =>
                            updateField("salarySenior", e.target.value)
                          }
                          placeholder="เช่น 50,000 – 80,000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career-skills">ทักษะที่ควรมี</Label>
                    <Textarea
                      id="career-skills"
                      value={form.skills}
                      onChange={(e) => updateField("skills", e.target.value)}
                      placeholder={
                        "เช่น Programming\nProblem solving\nTeamwork"
                      }
                      className="min-h-24"
                    />
                    <p className="text-xs text-muted-foreground">
                      ขึ้นบรรทัดใหม่ได้
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career-outlook">โอกาสเติบโต</Label>
                    <Textarea
                      id="career-outlook"
                      value={form.outlook}
                      onChange={(e) => updateField("outlook", e.target.value)}
                      placeholder="เช่น โตไปเป็น Tech Lead / Solution Architect"
                      className="min-h-24"
                    />
                  </div>
                </div>
              </AdminSection>
            </>
          ) : null}

          {type === "student_work" ? (
            <AdminSection title="รายละเอียดผลงาน">
              <>
                <div className="space-y-2">
                  <Label htmlFor="content-subtitle">หมวดหมู่</Label>
                  <AdminSelect
                    id="content-subtitle"
                    value={form.subtitle || "Software"}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                  >
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Hardware & Software">
                      Hardware & Software
                    </option>
                    <option value="Other">Other</option>
                  </AdminSelect>
                  <p className="text-xs text-muted-foreground">
                    ใช้แยกหมวดบนหน้าผลงานนักศึกษา
                  </p>
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
                  <Label htmlFor="content-project-url">
                    ลิงก์เข้าใช้งานผลงาน
                  </Label>
                  <Input
                    id="content-project-url"
                    value={form.projectUrl}
                    onChange={(e) => updateField("projectUrl", e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    ลิงก์เว็บ demo / โปรเจกต์
                    ให้ผู้เข้าชมกดเข้าไปใช้งานได้จากหน้า listing และใน popup
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-manual">คู่มือ / เนื้อหาเพิ่มเติม (popup)</Label>
                  <Textarea
                    id="content-manual"
                    value={form.manual}
                    onChange={(e) => updateField("manual", e.target.value)}
                    placeholder={`เช่น วิธีใช้งาน
1. เปิดแอป
2. เข้าสู่ระบบ...`}
                    className="min-h-28"
                  />
                  <p className="text-xs text-muted-foreground">
                    แสดงใน popup เมื่อกดการ์ดผลงาน — คนละส่วนกับคำอธิบายสั้นบนการ์ด
                  </p>
                </div>
                <FileUploadField
                  label="ไฟล์คู่มือ PDF (ไม่บังคับ)"
                  value={form.manualUrl}
                  onChange={(url) => updateField("manualUrl", url)}
                  kind="pdf"
                  accept="application/pdf"
                  hint="อัปโหลดคู่มือการใช้งานเป็น PDF สำหรับดาวน์โหลดใน popup"
                />
              </>
            </AdminSection>
          ) : null}

          {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

          <AdminFormActions>
            <div className="mr-auto">
              <AdminToggle
                id="content-published"
                checked={form.isPublished}
                onChange={(checked) => updateField("isPublished", checked)}
                label="แสดงบนเว็บทันที"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
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
