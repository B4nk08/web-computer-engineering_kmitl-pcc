package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

////////////////////////////////////////////////////////////
// QUIZ
////////////////////////////////////////////////////////////

type QuizKind string

const (
	QuizExternal QuizKind = "external"
	QuizInternal QuizKind = "internal"
)

type TrackGroup string

const (
	TrackIoT         TrackGroup = "iot"
	TrackSoftware    TrackGroup = "software"
	TrackNetwork     TrackGroup = "network"
	TrackProgramming TrackGroup = "programming"
)

type Quiz struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Kind        QuizKind  `gorm:"type:varchar(20);not null;index" json:"kind"`
	Title       string    `gorm:"size:255" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
}

func (q *Quiz) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&q.ID)
	return nil
}

func (Quiz) TableName() string { return "quizzes" }

type QuizQuestion struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	QuizID    uuid.UUID `gorm:"type:uuid;not null;index" json:"quiz_id"`
	Prompt    string    `gorm:"type:text" json:"prompt"`
	ImageURL  string    `gorm:"type:text" json:"image_url"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
}

func (q *QuizQuestion) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&q.ID)
	return nil
}

func (QuizQuestion) TableName() string { return "quiz_questions" }

type QuizOption struct {
	ID         uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	QuestionID uuid.UUID      `gorm:"type:uuid;not null;index" json:"question_id"`
	Label      string         `gorm:"type:text" json:"label"`
	ScoreMap   datatypes.JSON `gorm:"type:jsonb" json:"score_map,omitempty"`
	SortOrder  int            `gorm:"default:0" json:"sort_order"`
}

func (q *QuizOption) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&q.ID)
	return nil
}

func (QuizOption) TableName() string { return "quiz_options" }

type QuizAttempt struct {
	ID                uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	QuizID            uuid.UUID      `gorm:"type:uuid;not null;index" json:"quiz_id"`
	UserID            uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	Answers           datatypes.JSON `gorm:"type:jsonb" json:"answers,omitempty"`
	Result            datatypes.JSON `gorm:"type:jsonb" json:"result,omitempty"`
	RecommendedTrack  *TrackGroup    `gorm:"type:varchar(32)" json:"recommended_track,omitempty"`
	CompletedAt       *time.Time     `json:"completed_at,omitempty"`
}

func (q *QuizAttempt) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&q.ID)
	return nil
}

func (QuizAttempt) TableName() string { return "quiz_attempts" }
