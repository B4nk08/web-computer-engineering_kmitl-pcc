"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  };
}

function buildExtra(type: ApiContentType, form: FormState): Record<string, string> | undefined {
  const extra: Record<string, string> = {};
  if (type === "staff" && form.position.trim()) extra.position = form.position.trim();
  if (type === "video" && form.youtubeUrl.trim()) extra.youtube_url = form.youtubeUrl.trim();
  if (type === "admissions" && form.tuition.trim()) extra.tuition = form.tuition.trim();
  if (type === "student_work" && form.year.trim()) extra.year = form.year.trim();
  if (type === "career_path" && form.position.trim()) extra.role = form.position.trim();
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
  const [loadingDetail, setLoadingDetail] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heading = mode === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";

  useEffect(() => {
    setError(null);

    if (mode === "create") {
      setForm(emptyForm);
      setLoadingDetail(false);
      return;
    }

    if (!editId) return;

    let cancelled = false;
    setLoadingDetail(true);
    void getContentDetail(editId)
      .then((dto) => {
        if (!cancelled) setForm(dtoToForm(dto));
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
      extra: buildExtra(type, form),
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
            <Label htmlFor="content-slug">Slug</Label>
            <Input
              id="content-slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="เช่น curriculum"
            />
            <p className="text-xs text-muted-foreground">ใช้ใน URL (ไม่บังคับ)</p>
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

          <FileUploadField
            label="รูปภาพ"
            value={form.imageUrl}
            onChange={(url) => updateField("imageUrl", url)}
            kind="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hint="อัปโหลดไป S3 หรือวาง Image URL เอง"
          />

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

          {type === "video" ? (
            <div className="space-y-2">
              <Label htmlFor="content-youtube">YouTube URL</Label>
              <Input
                id="content-youtube"
                value={form.youtubeUrl}
                onChange={(e) => updateField("youtubeUrl", e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          ) : null}

          {type === "admissions" ? (
            <div className="space-y-2">
              <Label htmlFor="content-tuition">ค่าเทอม</Label>
              <Input
                id="content-tuition"
                value={form.tuition}
                onChange={(e) => updateField("tuition", e.target.value)}
                placeholder="เช่น 25,000 บาท / เทอม"
              />
            </div>
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
