package dto

import (
	"encoding/json"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// --- Quiz admin ---

type CreateQuizRequest struct {
	Kind          string `json:"kind" binding:"required"` // external | internal
	Title         string `json:"title" binding:"required"`
	Description   string `json:"description"`
	QuestionCount *int   `json:"question_count"`
	IsActive      *bool  `json:"is_active"`
}

type UpdateQuizRequest struct {
	Title         *string `json:"title"`
	Description   *string `json:"description"`
	QuestionCount *int    `json:"question_count"`
	IsActive      *bool   `json:"is_active"`
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
	Prompt    *string                    `json:"prompt"`
	ImageURL  *string                    `json:"image_url"`
	SortOrder *int                       `json:"sort_order"`
	Options   []CreateQuizOptionRequest  `json:"options"`
}

// SubmitQuizAttemptRequest คำตอบจากผู้ทำแบบทดสอบ
// answers: { "<question_id>": "<option_id>", ... }
type SubmitQuizAttemptRequest struct {
	Answers map[string]string `json:"answers" binding:"required"`
}

type QuizResponse struct {
	ID            string  `json:"id"`
	Kind          string  `json:"kind"`
	Slug          *string `json:"slug,omitempty"`
	Title         string  `json:"title"`
	Description   string  `json:"description"`
	QuestionCount int     `json:"question_count"`
	IsActive      bool    `json:"is_active"`
}

type CareerClusterResponse struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	NameEn      string `json:"name_en"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	SortOrder   int    `json:"sort_order"`
}

type CareerBrief struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Role     string `json:"role"`
	Detail   string `json:"detail"`
	ImageURL string `json:"image_url"`
}

type ClusterScoreView struct {
	Code        string        `json:"code"`
	Name        string        `json:"name"`
	NameEn      string        `json:"name_en"`
	Description string        `json:"description"`
	Score       float64       `json:"score"`
	Percent     int           `json:"percent"`
	Careers     []CareerBrief `json:"careers,omitempty"`
}

type InternalQuizResult struct {
	Kind            string             `json:"kind"`
	QuestionCount   int                `json:"question_count"`
	AnsweredCount   int                `json:"answered_count"`
	IsClose         bool               `json:"is_close"`
	RecommendedCode string             `json:"recommended_code,omitempty"`
	Clusters        []ClusterScoreView `json:"clusters"`
}

type ExternalQuizResult struct {
	Kind          string  `json:"kind"`
	QuestionCount int     `json:"question_count"`
	AnsweredCount int     `json:"answered_count"`
	Score         float64 `json:"score"`
	MaxScore      float64 `json:"max_score"`
	Percent       int     `json:"percent"`
	Band          string  `json:"band"`
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
		ID:            q.ID.String(),
		Kind:          string(q.Kind),
		Slug:          q.Slug,
		Title:         q.Title,
		Description:   q.Description,
		QuestionCount: q.QuestionCount,
		IsActive:      q.IsActive,
	}
}
