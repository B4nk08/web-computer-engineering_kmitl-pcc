package dto

import (
	"encoding/json"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// CreateContentRequest สร้าง content ใหม่ (type กำหนดชนิด เช่น staff / video)
type CreateContentRequest struct {
	Type        string          `json:"type" binding:"required"`
	Slug        *string         `json:"slug"`
	Title       string          `json:"title" binding:"required"`
	Body        string          `json:"body"`
	ImageURL    string          `json:"image_url"`
	Extra       json.RawMessage `json:"extra"` // ฟิลด์เฉพาะ type เช่น position, youtube_url, tuition
	SortOrder   int             `json:"sort_order"`
	IsPublished *bool           `json:"is_published"`
}

// UpdateContentRequest อัปเดต content (ทุกฟิลด์ optional)
type UpdateContentRequest struct {
	Slug        *string         `json:"slug"`
	Title       *string         `json:"title"`
	Body        *string         `json:"body"`
	ImageURL    *string         `json:"image_url"`
	Extra       json.RawMessage `json:"extra"`
	SortOrder   *int            `json:"sort_order"`
	IsPublished *bool           `json:"is_published"`
}

// ContentFilter ค่าจาก query string สำหรับ list
type ContentFilter struct {
	Type          string `form:"type"`           // page | staff | student_work | video | career_path | admissions
	Slug          string `form:"slug"`
	IsPublished   *bool  `form:"is_published"`   // ไม่ส่ง = ทั้งหมด
	PublishedOnly bool   `form:"published_only"` // true = เฉพาะที่เผยแพร่แล้ว
}

// ContentResponse ข้อมูล content ที่ส่งกลับ client
type ContentResponse struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	Slug        *string         `json:"slug,omitempty"`
	Title       string          `json:"title"`
	Body        string          `json:"body"`
	ImageURL    string          `json:"image_url"`
	Extra       json.RawMessage `json:"extra,omitempty"`
	SortOrder   int             `json:"sort_order"`
	IsPublished bool            `json:"is_published"`
	PublishedAt *time.Time      `json:"published_at,omitempty"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

func NewContentResponse(c *models.Content) ContentResponse {
	var extra json.RawMessage
	if len(c.Extra) > 0 {
		extra = json.RawMessage(c.Extra)
	}
	return ContentResponse{
		ID:          c.ID.String(),
		Type:        string(c.Type),
		Slug:        c.Slug,
		Title:       c.Title,
		Body:        c.Body,
		ImageURL:    c.ImageURL,
		Extra:       extra,
		SortOrder:   c.SortOrder,
		IsPublished: c.IsPublished,
		PublishedAt: c.PublishedAt,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}

func NewContentListResponse(items []models.Content) []ContentResponse {
	out := make([]ContentResponse, 0, len(items))
	for i := range items {
		out = append(out, NewContentResponse(&items[i]))
	}
	return out
}
