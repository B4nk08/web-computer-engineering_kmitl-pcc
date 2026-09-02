"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FileUploadFieldProps = {
  label?: string;
  /** URL ที่มีอยู่แล้ว (จาก DB) */
  value: string;
  onChange: (url: string) => void;
  /** ไฟล์ที่เลือกไว้ รอส่งพร้อม form (multipart) */
  pendingFile?: File | null;
  onPendingFileChange?: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  hint?: string;
};

export function FileUploadField({
  label = "รูปภาพ / ไฟล์",
  value,
  onChange,
  pendingFile = null,
  onPendingFileChange,
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf,video/mp4,video/webm",
  placeholder = "https://... หรือเลือกไฟล์ด้านขวา",
  hint = "เลือกไฟล์แล้วระบบจะอัปโหลด S3 พร้อมบันทึก (หรือวาง URL เอง)",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingFile || !pendingFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    onPendingFileChange?.(file);
  }

  function clear() {
    onPendingFileChange?.(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayImage =
    previewUrl ||
    (value &&
      (/\.(jpe?g|png|gif|webp)(\?|$)/i.test(value) || value.includes("/image/"))
      ? value
      : null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {displayImage ? (
        <div className="relative overflow-hidden rounded-md border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImage} alt="" className="mx-auto max-h-48 object-contain" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={clear}
            aria-label="ลบไฟล์"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={pendingFile ? pendingFile.name : value}
          onChange={(e) => {
            onPendingFileChange?.(null);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="flex-1"
          readOnly={Boolean(pendingFile)}
        />
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            เลือกไฟล์
          </Button>
        </div>
      </div>

      {pendingFile && !displayImage ? (
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <ImageIcon className="size-3.5 shrink-0" />
          รออัปโหลด: {pendingFile.name}
        </p>
      ) : null}

      {value && !pendingFile && !displayImage ? (
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <ImageIcon className="size-3.5 shrink-0" />
          {value}
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
