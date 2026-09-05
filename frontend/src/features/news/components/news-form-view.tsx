"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { ApiError } from "@/lib/api";
import { createNews, getNews, updateNews } from "../api";
import type { NewsAudience } from "../types";

export type NewsFormMode = "create" | "edit";

type NewsFormViewProps = {
  mode: NewsFormMode;
  sectionTitle: string;
  editId?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
};

type FormState = {
  audience: NewsAudience;
  title: string;
  body: string;
  imageUrl: string;
  isPublished: boolean;
};

const emptyForm: FormState = {
  audience: "external",
  title: "",
  body: "",
  imageUrl: "",
  isPublished: true,
};

function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

export function NewsFormView({
  mode,
  sectionTitle,
  editId,
  onCancel,
  onSuccess,
}: NewsFormViewProps) {
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

    let alive = true;
    setLoadingDetail(true);
    getNews(editId)
      .then((item) => {
        if (!alive) return;
        setForm({
          audience: item.audience,
          title: item.title,
          body: item.body,
          imageUrl: item.imageUrl,
          isPublished: item.isPublished,
        });
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      })
      .finally(() => {
        if (alive) setLoadingDetail(false);
      });

    return () => {
      alive = false;
    };
  }, [mode, editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("กรุณากรอกหัวข้อข่าว");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (mode === "create") {
        await createNews({
          audience: form.audience,
          title: form.title.trim(),
          body: form.body,
          image_url: form.imageUrl,
          is_published: form.isPublished,
        });
      } else if (editId) {
        await updateNews(editId, {
          audience: form.audience,
          title: form.title.trim(),
          body: form.body,
          image_url: form.imageUrl,
          is_published: form.isPublished,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="กลับ">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-xs text-muted-foreground">{sectionTitle}</p>
          <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        </div>
      </div>

      {loadingDetail ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          กำลังโหลด...
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mx-auto max-w-2xl space-y-5">
          <div className="space-y-2">
            <Label htmlFor="news-audience">ประเภทข่าว</Label>
            <select
              id="news-audience"
              value={form.audience}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  audience: e.target.value as NewsAudience,
                }))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="external">External — ข่าวสารทั่วไป (หน้าเว็บสาธารณะ)</option>
              <option value="internal">Internal — ข่าวภายใน (นักศึกษา/บุคลากร)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              External แสดงบนหน้า Home · Internal เก็บสำหรับผู้ล็อกอินภายใน
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="news-title">หัวข้อ</Label>
            <Input
              id="news-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="หัวข้อข่าวสาร"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news-body">เนื้อหา</Label>
            <Textarea
              id="news-body"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="รายละเอียดข่าว"
            />
          </div>

          <FileUploadField
            label="รูปภาพประกอบ"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            kind="image"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              className="size-4 rounded border"
            />
            เผยแพร่ทันที
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              บันทึก
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
