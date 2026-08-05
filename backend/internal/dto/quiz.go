package dto

import (
	"encoding/json"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// --- Quiz admin ---

type CreateQuizRequest struct {
	Kind        string `json:"kind" binding:"required"` // external | internal
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	IsActive    *bool  `json:"is_active"`
}

type UpdateQuizRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	IsActive    *bool   `json:"is_active"`
}

type QuizFilter struct {
	Kind     string `form:"kind"`
	IsActive *bool  `form:"is_active"`
}

type CreateQuizQuestionRequest struct {
	Prompt    string                    `json:"prompt" binding:"required"`
	ImageURL  string                    `json:"image_url"`
	SortOrder int                       `json:"sort_order"`
	Options   []CreateQuizOptionRequest `json:"options" binding:"required,min=2"`
}

type CreateQuizOptionRequest struct {
	Label     string          `json:"label" binding:"required"`
	ScoreMap  json.RawMessage `json:"score_map"` // เช่น {"iot":2,"software":0}
	SortOrder int             `json:"sort_order"`
}

type UpdateQuizQuestionRequest struct {
	Prompt    *string `json:"prompt"`
	ImageURL  *string `json:"image_url"`
	SortOrder *int    `json:"sort_order"`
}

// SubmitQuizAttemptRequest คำตอบจากผู้ทำแบบทดสอบ
// answers: { "<question_id>": "<option_id>", ... }
type SubmitQuizAttemptRequest struct {
	Answers map[string]string `json:"answers" binding:"required"`
}

type QuizResponse struct {
	ID          string `json:"id"`
	Kind        string `json:"kind"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IsActive    bool   `json:"is_active"`
}

type QuizOptionPublic struct {
	ID        string `json:"id"`
	Label     string `json:"label"`
	SortOrder int    `json:"sort_order"`
}

type QuizOptionAdmin struct {
	ID        string          `json:"id"`
	Label     string          `json:"label"`
	ScoreMap  json.RawMessage `json:"score_map,omitempty"`
	SortOrder int             `json:"sort_order"`
}

type QuizQuestionPublic struct {
	ID        string             `json:"id"`
	Prompt    string             `json:"prompt"`
	ImageURL  string             `json:"image_url"`
	SortOrder int                `json:"sort_order"`
	Options   []QuizOptionPublic `json:"options"`
}

type QuizQuestionAdmin struct {
	ID        string            `json:"id"`
	Prompt    string            `json:"prompt"`
	ImageURL  string            `json:"image_url"`
	SortOrder int               `json:"sort_order"`
	Options   []QuizOptionAdmin `json:"options"`
}

type QuizPlayResponse struct {
	Quiz      QuizResponse         `json:"quiz"`
	Questions []QuizQuestionPublic `json:"questions"`
}

type QuizDetailAdminResponse struct {
	Quiz      QuizResponse        `json:"quiz"`
	Questions []QuizQuestionAdmin `json:"questions"`
}

type QuizAttemptResponse struct {
	ID               string          `json:"id"`
	QuizID           string          `json:"quiz_id"`
	UserID           *string         `json:"user_id,omitempty"`
	Answers          json.RawMessage `json:"answers,omitempty"`
	Result           json.RawMessage `json:"result,omitempty"`
	RecommendedTrack *string         `json:"recommended_track,omitempty"`
	CompletedAt      *time.Time      `json:"completed_at,omitempty"`
}

func NewQuizResponse(q *models.Quiz) QuizResponse {
	return QuizResponse{
		ID:          q.ID.String(),
		Kind:        string(q.Kind),
		Title:       q.Title,
		Description: q.Description,
		IsActive:    q.IsActive,
	}
}
