"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { uploadFileToS3, type UploadKind } from "@/lib/api/upload";

type FileUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  kind?: UploadKind;
  accept?: string;
  placeholder?: string;
  hint?: string;
};

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
    setUploading(true);
    try {
      const { fileUrl } = await uploadFileToS3(file, kind);
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

  const isImage =
    kind === "image" ||
    /\.(jpe?g|png|gif|webp)(\?|$)/i.test(value) ||
    value.includes("image");

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

      {value && !isImage ? (
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
