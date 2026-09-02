package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

////////////////////////////////////////////////////////////
// CONTENTS + NEWS
////////////////////////////////////////////////////////////

type ContentType string

const (
	ContentAboutUs      ContentType = "about_us"
	ContentCurriculum   ContentType = "curriculum"
	ContentStaff        ContentType = "staff"
	ContentStudentWork  ContentType = "student_work"
	ContentCareerPath   ContentType = "career_path"
	ContentAdmissions   ContentType = "admissions"
)

type Content struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Type        ContentType    `gorm:"type:varchar(32);not null;index" json:"type"`
	Title       string         `gorm:"size:500" json:"title"`
	Body        string         `gorm:"type:text" json:"body"`
	FileURL     string         `gorm:"type:text" json:"file_url"` // S3 path/URL: image | video | pdf
	Extra       datatypes.JSON `gorm:"type:jsonb" json:"extra,omitempty"`
	SortOrder   int            `gorm:"default:0" json:"sort_order"`
	IsPublished bool           `gorm:"default:true" json:"is_published"`
	PublishedAt *time.Time     `json:"published_at,omitempty"`
	CreatedBy   *uuid.UUID     `gorm:"type:uuid;index" json:"created_by,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

func (c *Content) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&c.ID)
	return nil
}

func (Content) TableName() string { return "contents" }

type NewsAudience string

const (
	NewsExternal NewsAudience = "external"
	NewsInternal NewsAudience = "internal"
)

type News struct {
	ID          uuid.UUID    `gorm:"type:uuid;primaryKey" json:"id"`
	Audience    NewsAudience `gorm:"type:varchar(20);not null;index" json:"audience"`
	Title       string       `gorm:"size:500" json:"title"`
	Body        string       `gorm:"type:text" json:"body"`
	ImageURL    string       `gorm:"type:text" json:"image_url"`
	IsPublished bool         `gorm:"default:true" json:"is_published"`
	PublishedAt *time.Time   `json:"published_at,omitempty"`
	CreatedBy   *uuid.UUID   `gorm:"type:uuid;index" json:"created_by,omitempty"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

func (n *News) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&n.ID)
	return nil
}

func (News) TableName() string { return "news" }
