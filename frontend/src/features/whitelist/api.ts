import { apiClient, apiFormClient, endpoints } from "@/lib/api";
import type {
  CreateWhitelistInput,
  WhitelistEntryDto,
  WhitelistImportPreviewResponseDto,
  WhitelistImportResultDto,
  WhitelistImportRowInput,
} from "./types";

/** เพิ่มรายชื่อทีละคนเข้า ce_whitelist */
export async function createWhitelistEntry(
  input: CreateWhitelistInput
): Promise<WhitelistEntryDto> {
  return apiClient<WhitelistEntryDto>(endpoints.whitelist.create, {
    method: "POST",
    body: {
      email: input.email.trim(),
      full_name: input.full_name.trim(),
      role: input.role || undefined,
    },
  });
}

/** อัปโหลดไฟล์ CSV เพื่อตรวจสอบก่อน — ยังไม่เขียนลง DB */
export async function previewWhitelistImport(
  file: File
): Promise<WhitelistImportPreviewResponseDto> {
  const form = new FormData();
  form.append("file", file);
  return apiFormClient<WhitelistImportPreviewResponseDto>(
    endpoints.whitelist.importPreview,
    { method: "POST", formData: form }
  );
}

/** ยืนยันนำเข้าแถวที่เลือกไว้จากหน้า preview */
export async function commitWhitelistImport(
  rows: WhitelistImportRowInput[]
): Promise<WhitelistImportResultDto> {
  return apiClient<WhitelistImportResultDto>(endpoints.whitelist.importCommit, {
    method: "POST",
    body: { rows },
  });
}
