package dto

import (
	"encoding/json"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// CreateExamSubjectRequest เพิ่มกลุ่มวิชาใหม่ (code ห้ามแก้ทีหลัง เพราะถูกอ้างอิงใน exam_questions/exam_settings)
type CreateExamSubjectRequest struct {
	Code        string `json:"code" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
}

// UpdateExamSubjectRequest แก้ไขกลุ่มวิชา — ไม่มี field Code เพราะห้ามแก้
type UpdateExamSubjectRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	SortOrder   *int    `json:"sort_order"`
	IsActive    *bool   `json:"is_active"`
}

type ExamSubjectResponse struct {
	ID          string    `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	SortOrder   int       `json:"sort_order"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func NewExamSubjectResponse(s *models.ExamSubject) ExamSubjectResponse {
	return ExamSubjectResponse{
		ID:          s.ID.String(),
		Code:        s.Code,
		Name:        s.Name,
		Description: s.Description,
		SortOrder:   s.SortOrder,
		IsActive:    s.IsActive,
		CreatedAt:   s.CreatedAt,
		UpdatedAt:   s.UpdatedAt,
	}
}

// ExamChoice โครง choice ใน jsonb ของ exam_questions
type ExamChoice struct {
	Key       string `json:"key"`
	Text      string `json:"text"`
	IsCorrect bool   `json:"is_correct"`
}

type ExamChoicePublic struct {
	Key  string `json:"key"`
	Text string `json:"text"`
}

type CreateExamQuestionRequest struct {
	Subject  string       `json:"subject" binding:"required"` // iot|software|network|programming
	Mode     string       `json:"mode" binding:"required"`    // mock|real
	Prompt   string       `json:"prompt" binding:"required"`
	ImageURL string       `json:"image_url"`
	Choices  []ExamChoice `json:"choices" binding:"required,min=2"`
	IsActive *bool        `json:"is_active"`
}

type UpdateExamQuestionRequest struct {
	Prompt   *string      `json:"prompt"`
	ImageURL *string      `json:"image_url"`
	Choices  []ExamChoice `json:"choices"`
	IsActive *bool        `json:"is_active"`
}

type ExamQuestionFilter struct {
	Subject  string `form:"subject"`
	Mode     string `form:"mode"`
	IsActive *bool  `form:"is_active"`
}

type UpsertExamSettingRequest struct {
	Subject          string     `json:"subject" binding:"required"`
	Mode             string     `json:"mode" binding:"required"`
	QuestionCount    int        `json:"question_count" binding:"required,min=1"`
	TimeLimitMinutes *int       `json:"time_limit_minutes"`
	IsEnabled        *bool      `json:"is_enabled"`
	StartsAt         *time.Time `json:"starts_at"`
	EndsAt           *time.Time `json:"ends_at"`
}

type CreateExamCredentialRequest struct {
	Subject   string     `json:"subject" binding:"required"`
	UserID    *string    `json:"user_id"`
	ExpiresAt *time.Time `json:"expires_at"`
}

type StartExamRequest struct {
	Subject  string `json:"subject" binding:"required"`
	Mode     string `json:"mode" binding:"required"` // mock|real
	Username string `json:"username"`                // จำเป็นเมื่อ mode=real
	Password string `json:"password"`
}

// SubmitExamAttemptRequest answers: { "<question_id>": "<choice_key>", ... }
type SubmitExamAttemptRequest struct {
	Answers map[string]string `json:"answers" binding:"required"`
}

type ExamQuestionAdminResponse struct {
	ID        string       `json:"id"`
	Subject   string       `json:"subject"`
	Mode      string       `json:"mode"`
	Prompt    string       `json:"prompt"`
	ImageURL  string       `json:"image_url"`
	Choices   []ExamChoice `json:"choices"`
	IsActive  bool         `json:"is_active"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

type ExamQuestionPlayItem struct {
	ID       string             `json:"id"`
	Prompt   string             `json:"prompt"`
	ImageURL string             `json:"image_url"`
	Choices  []ExamChoicePublic `json:"choices"`
}

type ExamSettingResponse struct {
	ID               string     `json:"id"`
	Subject          string     `json:"subject"`
	Mode             string     `json:"mode"`
	QuestionCount    int        `json:"question_count"`
	TimeLimitMinutes *int       `json:"time_limit_minutes,omitempty"`
	IsEnabled        bool       `json:"is_enabled"`
	StartsAt         *time.Time `json:"starts_at,omitempty"`
	EndsAt           *time.Time `json:"ends_at,omitempty"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

type ExamCredentialResponse struct {
	ID        string     `json:"id"`
	Subject   string     `json:"subject"`
	UserID    *string    `json:"user_id,omitempty"`
	Username  string     `json:"username"`
	Password  string     `json:"password"` // ส่ง plain เฉพาะตอนสร้าง
	IsUsed    bool       `json:"is_used"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

type ExamAttemptStartResponse struct {
	AttemptID        string                 `json:"attempt_id"`
	Subject          string                 `json:"subject"`
	Mode             string                 `json:"mode"`
	TimeLimitMinutes *int                   `json:"time_limit_minutes,omitempty"`
	StartedAt        *time.Time             `json:"started_at,omitempty"`
	Questions        []ExamQuestionPlayItem `json:"questions"`
}

type ExamAttemptResultResponse struct {
	AttemptID   string     `json:"attempt_id"`
	Subject     string     `json:"subject"`
	Mode        string     `json:"mode"`
	Score       *float64   `json:"score"`
	MaxScore    *float64   `json:"max_score"`
	Status      string     `json:"status"`
	SubmittedAt *time.Time `json:"submitted_at,omitempty"`
}

type ExamAttemptAdminResponse struct {
	ID          string          `json:"id"`
	UserID      *string         `json:"user_id,omitempty"`
	Subject     string          `json:"subject"`
	Mode        string          `json:"mode"`
	Score       *float64        `json:"score,omitempty"`
	MaxScore    *float64        `json:"max_score,omitempty"`
	Status      string          `json:"status"`
	Answers     json.RawMessage `json:"answers,omitempty"`
	StartedAt   *time.Time      `json:"started_at,omitempty"`
	SubmittedAt *time.Time      `json:"submitted_at,omitempty"`
}

func NewExamSettingResponse(s *models.ExamSetting) ExamSettingResponse {
	return ExamSettingResponse{
		ID:               s.ID.String(),
		Subject:          string(s.Subject),
		Mode:             string(s.Mode),
		QuestionCount:    s.QuestionCount,
		TimeLimitMinutes: s.TimeLimitMinutes,
		IsEnabled:        s.IsEnabled,
		StartsAt:         s.StartsAt,
		EndsAt:           s.EndsAt,
		UpdatedAt:        s.UpdatedAt,
	}
}
