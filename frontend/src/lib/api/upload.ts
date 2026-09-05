import { apiClient, apiFormClient, endpoints } from "@/lib/api";

export type UploadKind = "image" | "video" | "pdf" | "file";

export type DirectUploadResponse = {
  key: string;
  file_url: string;
  content_type: string;
};

export type DeleteUploadResponse = {
  key: string;
  deleted: boolean;
};

/** อัปโหลดผ่าน backend → S3 (ไม่โดน CORS ของ bucket) */
export async function uploadFileToS3(
  file: File,
  kind: UploadKind
): Promise<{ fileUrl: string; key: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const data = await apiFormClient<DirectUploadResponse>(endpoints.uploads.direct, {
    method: "POST",
    formData,
  });

  return { fileUrl: data.file_url, key: data.key };
}

/** ลบไฟล์บน S3 ด้วย key หรือ file_url */
export async function deleteFileFromS3(input: {
  key?: string;
  fileUrl?: string;
}): Promise<DeleteUploadResponse> {
  return apiClient<DeleteUploadResponse>(endpoints.uploads.direct, {
    method: "DELETE",
    body: {
      key: input.key,
      file_url: input.fileUrl,
    },
  });
}
