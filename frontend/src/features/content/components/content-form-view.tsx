"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { ApiError } from "@/lib/api";
import { createContent, getContentDetail, updateContent } from "../api";
import type { ApiContentType, ContentDto, CreateContentInput } from "../types";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export type ContentFormMode = "create" | "edit";

type ContentFormViewProps = {
  mode: ContentFormMode;
  type: ApiContentType;
  sectionTitle: string;
  editId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
  /** ให้ parent (breadcrumb ฯลฯ) เรียก leave ที่เช็ค dirty */
  registerLeaveHandler?: (handler: () => void) => void;
};

type FormState = {
  title: string;
  body: string;
  fileUrl: string;
  sortOrder: string;
  isPublished: boolean;
  // staff / career_path
  position: string;
  // about_us
  videoUrl: string;
  imageUrl: string;
  shortDescription: string;
  // admissions
  tuition: string;
  capacity: string;
  qualifications: string;
  // student_work
  year: string;
  // curriculum
  programNameTh: string;
  programNameEn: string;
  degreeFullTh: string;
  degreeFullEn: string;
  degreeShortTh: string;
  degreeShortEn: string;
  location: string;
  language: string;
  systemDescription: string;
  durationYears: string;
  totalCredits: string;
  studySystem: string;
};

const emptyForm: FormState = {
  title: "",
  body: "",
  fileUrl: "",
  sortOrder: "0",
  isPublished: true,
  position: "",
  videoUrl: "",
  imageUrl: "",
  shortDescription: "",
  tuition: "",
  capacity: "",
  qualifications: "",
  year: "",
  programNameTh: "",
  programNameEn: "",
  degreeFullTh: "",
  degreeFullEn: "",
  degreeShortTh: "",
  degreeShortEn: "",
  location: "",
  language: "",
  systemDescription: "",
  durationYears: "4",
  totalCredits: "138",
  studySystem: "ทวิภาค",
};

function readExtraString(extra: unknown, key: string): string {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return "";
  const value = (extra as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function readExtraStringArray(extra: unknown, key: string): string {
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) return "";
  const value = (extra as Record<string, unknown>)[key];
  if (Array.isArray(value)) {
    return value.map(String).join("\n");
  }
  return typeof value === "string" ? value : "";
}

function dtoToForm(dto: ContentDto): FormState {
  const extra = dto.extra;
  return {
    ...emptyForm,
    title: dto.title ?? "",
    body: dto.body ?? "",
    fileUrl: dto.file_url ?? "",
    sortOrder: String(dto.sort_order ?? 0),
    isPublished: dto.is_published ?? true,
    position: readExtraString(extra, "position") || readExtraString(extra, "role"),
    videoUrl: readExtraString(extra, "video_url"),
    imageUrl: readExtraString(extra, "image_url"),
    shortDescription: readExtraString(extra, "short_description"),
    tuition: readExtraString(extra, "tuition"),
    capacity: readExtraString(extra, "capacity"),
    qualifications: readExtraStringArray(extra, "qualifications"),
    year: readExtraString(extra, "year"),
    programNameTh: readExtraString(extra, "program_name_th"),
    programNameEn: readExtraString(extra, "program_name_en"),
    degreeFullTh: readExtraString(extra, "degree_full_th"),
    degreeFullEn: readExtraString(extra, "degree_full_en"),
    degreeShortTh: readExtraString(extra, "degree_short_th"),
    degreeShortEn: readExtraString(extra, "degree_short_en"),
    location: readExtraString(extra, "location"),
    language: readExtraString(extra, "language"),
    systemDescription: readExtraString(extra, "system_description"),
    durationYears: readExtraString(extra, "duration_years") || "4",
    totalCredits: readExtraString(extra, "total_credits") || "138",
    studySystem: readExtraString(extra, "study_system") || "ทวิภาค",
  };
}

function buildExtra(
  type: ApiContentType,
  form: FormState
): Record<string, unknown> | undefined {
  if (type === "staff" && form.position.trim()) {
    return { position: form.position.trim() };
  }
  if (type === "career_path" && form.position.trim()) {
    return { role: form.position.trim() };
  }
  if (type === "student_work" && form.year.trim()) {
    return { year: form.year.trim() };
  }
  if (type === "admissions") {
    const extra: Record<string, unknown> = {};
    if (form.tuition.trim()) extra.tuition = form.tuition.trim();
    if (form.capacity.trim()) extra.capacity = form.capacity.trim();
    const quals = form.qualifications
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (quals.length > 0) extra.qualifications = quals;
    return Object.keys(extra).length > 0 ? extra : undefined;
  }
  if (type === "about_us") {
    const extra: Record<string, unknown> = {};
    if (form.videoUrl.trim()) extra.video_url = form.videoUrl.trim();
    if (form.imageUrl.trim()) extra.image_url = form.imageUrl.trim();
    if (form.shortDescription.trim()) {
      extra.short_description = form.shortDescription.trim();
    }
    return Object.keys(extra).length > 0 ? extra : undefined;
  }
  if (type === "curriculum") {
    const extra: Record<string, unknown> = {};
    const pairs: [keyof FormState, string][] = [
      ["programNameTh", "program_name_th"],
      ["programNameEn", "program_name_en"],
      ["degreeFullTh", "degree_full_th"],
      ["degreeFullEn", "degree_full_en"],
      ["degreeShortTh", "degree_short_th"],
      ["degreeShortEn", "degree_short_en"],
      ["location", "location"],
      ["language", "language"],
      ["systemDescription", "system_description"],
      ["studySystem", "study_system"],
    ];
    for (const [formKey, jsonKey] of pairs) {
      const value = String(form[formKey] ?? "").trim();
      if (value) extra[jsonKey] = value;
    }
    const years = Number.parseInt(form.durationYears, 10);
    if (Number.isFinite(years)) extra.duration_years = years;
    const credits = Number.parseInt(form.totalCredits, 10);
    if (Number.isFinite(credits)) extra.total_credits = credits;
    return Object.keys(extra).length > 0 ? extra : undefined;
  }
  return undefined;
}

function fileUploadConfig(type: ApiContentType): {
  label: string;
  accept: string;
  hint: string;
} {
  if (type === "curriculum") {
    return {
      label: "ไฟล์ PDF หลักสูตร",
      accept: "application/pdf",
      hint: "เลือกไฟล์แล้วระบบอัป S3 พร้อมบันทึก หรือวาง URL เอง",
    };
  }
  if (type === "about_us") {
    return {
      label: "ไฟล์แนบหลัก (ถ้ามี)",
      accept:
        "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf",
      hint: "ไฟล์หลัก — รูป About Us เลือกแยกด้านล่าง",
    };
  }
  return {
    label: "ไฟล์ / รูปภาพ (S3)",
    accept:
      "image/jpeg,image/png,image/webp,image/gif,application/pdf,video/mp4,video/webm",
    hint: "เลือกไฟล์แล้วระบบอัป S3 พร้อมบันทึก หรือวาง URL เอง",
  };
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
  registerLeaveHandler,
}: ContentFormViewProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [baseline, setBaseline] = useState<FormState>(emptyForm);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const heading = mode === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
  const fileCfg = fileUploadConfig(type);

  const dirty =
    JSON.stringify(form) !== JSON.stringify(baseline) ||
    pendingFile !== null ||
    pendingImage !== null;

  const requestLeave = useCallback(() => {
    if (!dirty) {
      onCancel();
      return;
    }
    setLeaveOpen(true);
  }, [dirty, onCancel]);

  useEffect(() => {
    registerLeaveHandler?.(requestLeave);
  }, [registerLeaveHandler, requestLeave]);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    setError(null);
    setPendingFile(null);
    setPendingImage(null);
    setLeaveOpen(false);

    if (mode === "create") {
      setForm(emptyForm);
      setBaseline(emptyForm);
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
          setForm(next);
          setBaseline(next);
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
      body: form.body.trim(),
      file_url: form.fileUrl.trim(),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: form.isPublished,
      extra: buildExtra(type, form),
    };
    const files = {
      file: pendingFile,
      image: type === "about_us" ? pendingImage : null,
    };

    setSubmitting(true);
    setError(null);
    try {
      if (mode === "create") {
        const input: CreateContentInput = { type, ...payloadBase };
        await createContent(input, files);
      } else if (editId) {
        await updateContent(editId, payloadBase, files);
      }
      setBaseline(form);
      setPendingFile(null);
      setPendingImage(null);
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
              onClick={requestLeave}
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
              placeholder="ชื่อรายการ"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-body">รายละเอียด</Label>
            <Textarea
              id="content-body"
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              placeholder="เนื้อหา / คำอธิบายยาว"
            />
          </div>

          <FileUploadField
            label={fileCfg.label}
            value={form.fileUrl}
            onChange={(url) => updateField("fileUrl", url)}
            pendingFile={pendingFile}
            onPendingFileChange={setPendingFile}
            accept={fileCfg.accept}
            hint={fileCfg.hint}
          />

          {type === "about_us" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="about-video">Video URL</Label>
                <Input
                  id="about-video"
                  value={form.videoUrl}
                  onChange={(e) => updateField("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/... หรือ S3 video URL"
                />
              </div>
              <FileUploadField
                label="รูปภาพ (About Us)"
                value={form.imageUrl}
                onChange={(url) => updateField("imageUrl", url)}
                pendingFile={pendingImage}
                onPendingFileChange={setPendingImage}
                accept="image/jpeg,image/png,image/webp,image/gif"
                hint="เลือกไฟล์แล้วอัป S3 พร้อมบันทึก หรือวาง URL เอง"
              />
              <div className="space-y-2">
                <Label htmlFor="about-short">คำอธิบายสั้น ๆ</Label>
                <Textarea
                  id="about-short"
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  placeholder="ข้อความสั้นใต้วิดีโอ / แนะนำสาขา"
                />
              </div>
            </>
          ) : null}

          {type === "curriculum" ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>ชื่อหลักสูตร (ไทย)</Label>
                  <Input
                    value={form.programNameTh}
                    onChange={(e) => updateField("programNameTh", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>ชื่อหลักสูตร (อังกฤษ)</Label>
                  <Input
                    value={form.programNameEn}
                    onChange={(e) => updateField("programNameEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อเต็มปริญญา (ไทย)</Label>
                  <Input
                    value={form.degreeFullTh}
                    onChange={(e) => updateField("degreeFullTh", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อเต็มปริญญา (อังกฤษ)</Label>
                  <Input
                    value={form.degreeFullEn}
                    onChange={(e) => updateField("degreeFullEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อย่อ (ไทย)</Label>
                  <Input
                    value={form.degreeShortTh}
                    onChange={(e) => updateField("degreeShortTh", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ชื่อย่อ (อังกฤษ)</Label>
                  <Input
                    value={form.degreeShortEn}
                    onChange={(e) => updateField("degreeShortEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>สถานที่จัดการเรียนการสอน</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>ภาษาที่ใช้</Label>
                  <Input
                    value={form.language}
                    onChange={(e) => updateField("language", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>รูปแบบระบบการศึกษา</Label>
                  <Textarea
                    value={form.systemDescription}
                    onChange={(e) => updateField("systemDescription", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ระยะเวลา (ปี)</Label>
                  <Input
                    type="number"
                    value={form.durationYears}
                    onChange={(e) => updateField("durationYears", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>หน่วยกิตรวม</Label>
                  <Input
                    type="number"
                    value={form.totalCredits}
                    onChange={(e) => updateField("totalCredits", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ระบบการศึกษา</Label>
                  <Input
                    value={form.studySystem}
                    onChange={(e) => updateField("studySystem", e.target.value)}
                    placeholder="ทวิภาค"
                  />
                </div>
              </div>
            </>
          ) : null}

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

          {type === "admissions" ? (
            <>
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
                <Label htmlFor="content-capacity">จำนวนรับ</Label>
                <Input
                  id="content-capacity"
                  value={form.capacity}
                  onChange={(e) => updateField("capacity", e.target.value)}
                  placeholder="เช่น 40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-quals">คุณสมบัติ (บรรทัดละ 1 ข้อ)</Label>
                <Textarea
                  id="content-quals"
                  value={form.qualifications}
                  onChange={(e) => updateField("qualifications", e.target.value)}
                  placeholder={"ต้องสำเร็จ ม.6 หรือเทียบเท่า\nผ่านการคัดเลือกตามเกณฑ์..."}
                />
              </div>
            </>
          ) : null}

          {type === "student_work" ? (
            <div className="space-y-2">
              <Label htmlFor="content-year">ปีการศึกษา</Label>
              <Input
                id="content-year"
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                placeholder="เช่น 2568"
              />
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-sort">ลำดับ</Label>
              <Input
                id="content-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-published">สถานะ</Label>
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
                เผยแพร่ทันที
              </label>
            </div>
          </div>

          {error ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={requestLeave}
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
          </div>
        </form>
      )}

      <UnsavedChangesDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        onStay={() => setLeaveOpen(false)}
        onDiscard={() => {
          setLeaveOpen(false);
          onCancel();
        }}
      />
    </div>
  );
}
