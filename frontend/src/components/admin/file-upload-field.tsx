"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { uploadFileToS3, type UploadKind } from "@/lib/api/upload";

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // ต้องตรงกับ backend

type FileUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  kind?: UploadKind;
  accept?: string;
  placeholder?: string;
  hint?: string;
};

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileUploadField({
  label = "รูปภาพ / ไฟล์",
  value,
  onChange,
  kind = "image",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  placeholder = "https://...",
  hint = "อัปโหลดไป S3 หรือวาง URL เอง",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(
        `ไฟล์ใหญ่เกินไป (${formatMb(file.size)}) — จำกัด ${formatMb(MAX_UPLOAD_BYTES)}`
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploadKind: UploadKind =
        kind === "file"
          ? file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("image/")
              ? "image"
              : "file"
          : kind;
      const { fileUrl } = await uploadFileToS3(file, uploadKind);
      onChange(fileUrl);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "อัปโหลดไม่สำเร็จ";
      setError(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isVideo =
    kind === "video" ||
    /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(value) ||
    value.includes("/uploads/video/");

  const isImage =
    !isVideo &&
    (kind === "image" ||
      /\.(jpe?g|png|gif|webp)(\?|$)/i.test(value) ||
      value.includes("/uploads/image/"));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value && isImage ? (
        <div className="relative overflow-hidden rounded-md border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="mx-auto max-h-48 object-contain" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
            aria-label="ลบรูป"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      {value && isVideo ? (
        <div className="relative overflow-hidden rounded-md border bg-muted/30">
          <video
            src={value}
            className="mx-auto max-h-48 w-full object-contain"
            controls
            preload="metadata"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
            aria-label="ลบวิดีโอ"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                กำลังอัปโหลด...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                อัปโหลด
              </>
            )}
          </Button>
        </div>
      </div>

      {value && !isImage && !isVideo ? (
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <ImageIcon className="size-3.5 shrink-0" />
          {value}
        </p>
      ) : null}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
