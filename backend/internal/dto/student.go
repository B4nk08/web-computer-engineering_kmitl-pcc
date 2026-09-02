package dto

// StudentResponse รายชื่อนักศึกษาจาก ce_whitelist
type StudentResponse struct {
	ID          string  `json:"id"`
	Email       string  `json:"email"`
	StudentCode *string `json:"student_code,omitempty"`
	FullName    string  `json:"full_name"`
	Role        string  `json:"role"`
	// Cohort เช่น CE01 จากรหัสนักศึกษา (64 → CE01)
	Cohort *string `json:"cohort,omitempty"`
}
