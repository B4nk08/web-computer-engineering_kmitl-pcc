"use client";

import { useRef, useState } from "react";
import { FileText, Link2, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { uploadFileToS3, type UploadKind } from "@/lib/api/upload";
import { cn } from "@/lib/utils";

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // ต้องตรงกับ backend

type FileUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  kind?: UploadKind;
  accept?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
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
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLink, setShowLink] = useState(false);

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

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      className="hidden"
      onChange={(e) => void handleFile(e.target.files?.[0])}
    />
  );

  const changeButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={uploading}
      onClick={() => inputRef.current?.click()}
    >
      {uploading ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          กำลังอัปโหลด...
        </>
      ) : (
        <>
          <Upload className="size-3.5" />
          เปลี่ยนไฟล์
        </>
      )}
    </Button>
  );

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <Label>{label}</Label>
      {fileInput}

      {!value ? (
        <div className="admin-dropzone">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white text-primary">
            <Upload className="size-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">อัปโหลดไฟล์</p>
            <p className="text-xs text-muted-foreground">เลือกจากเครื่องได้เลย</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                กำลังอัปโหลด...
              </>
            ) : (
              "เลือกไฟล์"
            )}
          </Button>
          <button
            type="button"
            className="text-xs text-primary underline-offset-4 hover:underline"
            onClick={() => setShowLink((open) => !open)}
          >
            {showLink ? "ซ่อนช่องลิงก์" : "หรือวางลิงก์"}
          </button>
          {showLink ? (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="max-w-md bg-white"
            />
          ) : null}
        </div>
      ) : isImage || isVideo ? (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="relative flex h-[28rem] items-center justify-center bg-[#eef1f5] px-6">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={value}
                className="max-h-full max-w-full"
                controls
                preload="metadata"
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full border-white/80 bg-white/95 shadow-sm"
              onClick={() => onChange("")}
              aria-label={isVideo ? "ลบวิดีโอ" : "ลบรูป"}
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">{isVideo ? "วิดีโอ" : "รูปภาพ"}</p>
            {changeButton}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">ไฟล์พร้อมใช้งาน</p>
            <p className="truncate text-xs text-muted-foreground">อัปโหลดแล้ว</p>
          </div>
          {changeButton}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onChange("")}
            aria-label="ลบไฟล์"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {value && showLink ? (
        <div className="flex items-center gap-2">
          <Link2 className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-rose-700">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {hint}
          {value ? (
            <>
              {" "}
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => setShowLink((open) => !open)}
              >
                {showLink ? "ซ่อนลิงก์" : "แก้ไขลิงก์"}
              </button>
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}
