package dto

// WhitelistEntryResponse รายการเดียวใน ce_whitelist
type WhitelistEntryResponse struct {
	ID          string  `json:"id"`
	Email       string  `json:"email"`
	StudentCode *string `json:"student_code,omitempty"`
	FullName    string  `json:"full_name"`
	Role        string  `json:"role"`
	Cohort      *string `json:"cohort,omitempty"`
}

// WhitelistCreateRequest เพิ่มรายชื่อทีละคน (POST /api/whitelist)
type WhitelistCreateRequest struct {
	Email    string `json:"email" binding:"required"`
	FullName string `json:"full_name" binding:"required"`
	// Role ถ้าไม่ระบุ default เป็น student
	Role string `json:"role"`
}

// WhitelistImportRow แถวข้อมูลหนึ่งแถวจาก CSV (หรือจากหน้า preview ที่ user เลือกแล้ว)
type WhitelistImportRow struct {
	Line     int    `json:"line"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
}

// WhitelistImportRowPreview ผลตรวจสอบของแต่ละแถว (ยังไม่เขียน DB)
type WhitelistImportRowPreview struct {
	Line     int    `json:"line"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	// Status: "new" | "update" | "duplicate" | "error"
	Status           string  `json:"status"`
	ExistingFullName *string `json:"existing_full_name,omitempty"`
	ExistingRole     *string `json:"existing_role,omitempty"`
	Error            string  `json:"error,omitempty"`
}

// WhitelistImportSummary สรุปจำนวนแถวตามสถานะ
type WhitelistImportSummary struct {
	New        int `json:"new"`
	Update     int `json:"update"`
	Duplicates int `json:"duplicates"`
	Errors     int `json:"errors"`
}

// WhitelistImportPreviewResponse ผลลัพธ์ของ POST /api/whitelist/import/preview
type WhitelistImportPreviewResponse struct {
	Rows    []WhitelistImportRowPreview `json:"rows"`
	Summary WhitelistImportSummary      `json:"summary"`
}

// WhitelistImportCommitRequest ใช้กับ POST /api/whitelist/import/commit
type WhitelistImportCommitRequest struct {
	Rows []WhitelistImportRow `json:"rows" binding:"required"`
}

// WhitelistImportResult ผลลัพธ์การเขียนจริงลง DB
type WhitelistImportResult struct {
	Inserted int      `json:"inserted"`
	Updated  int      `json:"updated"`
	Skipped  int      `json:"skipped"`
	Errors   []string `json:"errors,omitempty"`
}
