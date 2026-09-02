export type WhitelistRole = "student" | "teacher" | "admin";

export type WhitelistEntryDto = {
  id: string;
  email: string;
  student_code?: string;
  full_name: string;
  role: string;
  cohort?: string;
};

export type CreateWhitelistInput = {
  email: string;
  full_name: string;
  /** ถ้าไม่ระบุ backend จะ default เป็น student */
  role?: WhitelistRole | "";
};

/** สถานะของแต่ละแถวจากหน้า preview */
export type WhitelistImportRowStatus = "new" | "update" | "duplicate" | "error";

export type WhitelistImportRowPreviewDto = {
  line: number;
  email: string;
  full_name: string;
  role: string;
  status: WhitelistImportRowStatus;
  existing_full_name?: string;
  existing_role?: string;
  error?: string;
};

export type WhitelistImportSummaryDto = {
  new: number;
  update: number;
  duplicates: number;
  errors: number;
};

export type WhitelistImportPreviewResponseDto = {
  rows: WhitelistImportRowPreviewDto[];
  summary: WhitelistImportSummaryDto;
};

/** แถวที่จะส่งไป commit จริง (มาจาก preview ที่ user เลือกไว้) */
export type WhitelistImportRowInput = {
  line: number;
  email: string;
  full_name: string;
  role: string;
};

export type WhitelistImportResultDto = {
  inserted: number;
  updated: number;
  skipped: number;
  errors?: string[];
};
