package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

////////////////////////////////////////////////////////////
// CE EXIT EXAM
////////////////////////////////////////////////////////////

type ExamMode string

const (
	ExamMock ExamMode = "mock"
	ExamReal ExamMode = "real"
)

type AttemptStatus string

const (
	AttemptInProgress AttemptStatus = "in_progress"
	AttemptSubmitted  AttemptStatus = "submitted"
	AttemptExpired    AttemptStatus = "expired"
)

type ExamQuestion struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Subject      TrackGroup     `gorm:"type:varchar(32);not null;index" json:"subject"`
	Mode         ExamMode       `gorm:"type:varchar(16);not null;index" json:"mode"`
	Prompt       string         `gorm:"type:text" json:"prompt"`
	ImageURL     string         `gorm:"type:text" json:"image_url"`
	Choices      datatypes.JSON `gorm:"type:jsonb" json:"choices,omitempty"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	CreatedBy    *uuid.UUID     `gorm:"type:uuid;index" json:"created_by,omitempty"`
	SourcePDFURL string         `gorm:"type:text" json:"source_pdf_url"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

func (e *ExamQuestion) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&e.ID)
	return nil
}

func (ExamQuestion) TableName() string { return "exam_questions" }

// ExamSetting — ตั้งค่าการสอบต่อ subject+mode (ไม่จัดชุดข้อตายตัว)
type ExamSetting struct {
	ID                uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Subject           TrackGroup `gorm:"type:varchar(32);not null;uniqueIndex:idx_exam_settings_subject_mode" json:"subject"`
	Mode              ExamMode   `gorm:"type:varchar(16);not null;uniqueIndex:idx_exam_settings_subject_mode" json:"mode"`
	QuestionCount     int        `gorm:"not null" json:"question_count"`
	TimeLimitMinutes  *int       `json:"time_limit_minutes,omitempty"`
	IsEnabled         bool       `gorm:"default:true" json:"is_enabled"`
	StartsAt          *time.Time `json:"starts_at,omitempty"`
	EndsAt            *time.Time `json:"ends_at,omitempty"`
	UpdatedBy         *uuid.UUID `gorm:"type:uuid;index" json:"updated_by,omitempty"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

func (e *ExamSetting) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&e.ID)
	return nil
}

func (ExamSetting) TableName() string { return "exam_settings" }

type ExamCredential struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Subject   TrackGroup `gorm:"type:varchar(32);not null;index" json:"subject"`
	UserID    *uuid.UUID `gorm:"type:uuid;index" json:"user_id,omitempty"`
	Username  string     `gorm:"uniqueIndex;size:120;not null" json:"username"`
	Password  string     `gorm:"size:255;not null" json:"password"`
	IsUsed    bool       `gorm:"default:false" json:"is_used"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

func (e *ExamCredential) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&e.ID)
	return nil
}

func (ExamCredential) TableName() string { return "exam_credentials" }

type ExamAttempt struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	UserID         *uuid.UUID     `gorm:"type:uuid;index" json:"user_id,omitempty"`
	Subject        TrackGroup     `gorm:"type:varchar(32);not null;index" json:"subject"`
	Mode           ExamMode       `gorm:"type:varchar(16);not null;index" json:"mode"`
	CredentialID   *uuid.UUID     `gorm:"type:uuid;index" json:"credential_id,omitempty"`
	QuestionOrder  datatypes.JSON `gorm:"type:jsonb" json:"question_order,omitempty"`
	ChoiceOrderMap datatypes.JSON `gorm:"type:jsonb" json:"choice_order_map,omitempty"`
	Answers        datatypes.JSON `gorm:"type:jsonb" json:"answers,omitempty"`
	Score          *float64       `gorm:"type:numeric" json:"score,omitempty"`
	MaxScore       *float64       `gorm:"type:numeric" json:"max_score,omitempty"`
	Status         AttemptStatus  `gorm:"type:varchar(20);default:'in_progress'" json:"status"`
	StartedAt      *time.Time     `json:"started_at,omitempty"`
	SubmittedAt    *time.Time     `json:"submitted_at,omitempty"`
}

func (e *ExamAttempt) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&e.ID)
	return nil
}

func (ExamAttempt) TableName() string { return "exam_attempts" }
