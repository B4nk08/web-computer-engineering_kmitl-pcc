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
} from "@/components/admin";
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
  return <AdminTextarea {...props} />;
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
    <AdminFormShell
      heading={heading}
      sectionTitle={sectionTitle}
      locationHint="รับสมัครโชว์ที่ /news · ภายในสาขาโชว์ที่ /news/internal หลังล็อกอิน"
      onBack={onCancel}
    >
      {loadingDetail ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          กำลังโหลด...
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mx-auto max-w-3xl space-y-5">
          <AdminSection title="เนื้อหาข่าว">
          <div className="space-y-2">
            <Label htmlFor="news-audience">ประเภทข่าว</Label>
            <AdminSelect
              id="news-audience"
              value={form.audience}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  audience: e.target.value as NewsAudience,
                }))
              }
            >
              <option value="external">ประกาศรับสมัคร — ทุกคนเห็น (ผู้เยี่ยมชมและคนในภาควิชา)</option>
              <option value="internal">ประกาศภายในสาขา — เฉพาะผู้เข้าสู่ระบบ</option>
            </AdminSelect>
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
              placeholder={"คุณสมบัติผู้สมัคร ...\nสมัครออนไลน์: ..."}
            />
            <p className="text-xs text-muted-foreground">
              ขึ้นบรรทัดใหม่ได้ — แต่ละบรรทัดจะแสดงแยกกันบนหน้า News
            </p>
          </div>
          </AdminSection>

          <AdminSection title="สื่อและการเผยแพร่">
          <FileUploadField
            label="รูปภาพประกอบ"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            kind="image"
          />
          <AdminToggle
            checked={form.isPublished}
            onChange={(checked) => setForm((f) => ({ ...f, isPublished: checked }))}
            label="เผยแพร่ทันที"
          />
          </AdminSection>

          {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

          <AdminFormActions>
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              บันทึก
            </Button>
          </AdminFormActions>
        </form>
      )}
    </AdminFormShell>
  );
}
