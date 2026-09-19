"use client";

import { useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { uploadFileToS3 } from "@/lib/api/upload";

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

type GalleryUploadFieldProps = {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
  max?: number;
};

export function GalleryUploadField({
  label,
  values,
  onChange,
  hint = "อัปโหลดรูปเพิ่มเติมสำหรับกริดในหน้ากิจกรรม",
  max = 8,
}: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = max - values.length;
    if (remaining <= 0) {
      setError(`อัปโหลดได้ไม่เกิน ${max} รูป`);
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    if (picked.some((file) => file.size > MAX_UPLOAD_BYTES)) {
      setError("มีไฟล์ใหญ่เกิน 500MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of picked) {
        const { fileUrl } = await uploadFileToS3(file, "image");
        uploaded.push(fileUrl);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "อัปโหลดไม่สำเร็จ",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-muted/20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-1.5 top-1.5 h-7 w-7"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              aria-label="ลบรูป"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
        {values.length < max ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5" />
            )}
            <span className="text-[11px]">{uploading ? "กำลังอัปโหลด" : "เพิ่มรูป"}</span>
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        {error ?? `${hint} (${values.length}/${max})`}
      </p>
    </div>
  );
}
