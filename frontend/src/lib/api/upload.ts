import { apiClient, endpoints } from "@/lib/api";

export type UploadKind = "image" | "video" | "pdf" | "file";

export type PresignUploadResponse = {
  key: string;
  upload_url: string;
  file_url: string;
  content_type: string;
  expires_in_seconds: number;
};

export async function presignUpload(input: {
  filename: string;
  contentType: string;
  kind: UploadKind;
}): Promise<PresignUploadResponse> {
  return apiClient<PresignUploadResponse>(endpoints.uploads.presign, {
    method: "POST",
    body: {
      filename: input.filename,
      content_type: input.contentType,
      kind: input.kind,
    },
  });
}

/** ขอ presign จาก backend แล้ว PUT ไฟล์ตรงไป S3 — คืน public URL */
export async function uploadFileToS3(
  file: File,
  kind: UploadKind
): Promise<{ fileUrl: string; key: string }> {
  const contentType = file.type || "application/octet-stream";
  const signed = await presignUpload({
    filename: file.name,
    contentType,
    kind,
  });

  const put = await fetch(signed.upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!put.ok) {
    throw new Error(`อัปโหลดไป S3 ไม่สำเร็จ (${put.status})`);
  }

  return { fileUrl: signed.file_url, key: signed.key };
}
