package dto

import (
	"encoding/json"
	"net/url"
	"path"
	"regexp"
	"strings"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// CreateContentRequest สร้าง content ใหม่
type CreateContentRequest struct {
	Type        string          `json:"type" binding:"required"`
	Title       string          `json:"title" binding:"required"`
	Body        string          `json:"body"`
	FileURL     string          `json:"file_url"`
	Extra       json.RawMessage `json:"extra"` // ฟิลด์เฉพาะ type
	SortOrder   int             `json:"sort_order"`
	IsPublished *bool           `json:"is_published"`
}

// UpdateContentRequest อัปเดต content (ทุกฟิลด์ optional)
type UpdateContentRequest struct {
	Title       *string         `json:"title"`
	Body        *string         `json:"body"`
	FileURL     *string         `json:"file_url"`
	Extra       json.RawMessage `json:"extra"`
	SortOrder   *int            `json:"sort_order"`
	IsPublished *bool           `json:"is_published"`
}

// ContentFilter ค่าจาก query string สำหรับ list
type ContentFilter struct {
	Type          string `form:"type"` // about_us | curriculum | staff | student_work | career_path | admissions
	IsPublished   *bool  `form:"is_published"`
	PublishedOnly bool   `form:"published_only"`
}

// ContentResponse ข้อมูล content ที่ส่งกลับ client
type ContentResponse struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	Title       string          `json:"title"`
	Body        string          `json:"body"`
	FileURL     string          `json:"file_url"`
	FileName    string          `json:"file_name,omitempty"` // ชื่อไฟล์สำหรับแสดง (ไม่มี path)
	Extra       json.RawMessage `json:"extra,omitempty"`
	SortOrder   int             `json:"sort_order"`
	IsPublished bool            `json:"is_published"`
	PublishedAt *time.Time      `json:"published_at,omitempty"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

var uuidFilePrefix = regexp.MustCompile(`(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-`)

func fileNameFromURL(fileURL string) string {
	fileURL = strings.TrimSpace(fileURL)
	if fileURL == "" {
		return ""
	}
	if u, err := url.Parse(fileURL); err == nil && u.Path != "" {
		fileURL = u.Path
	}
	base := path.Base(fileURL)
	if base == "." || base == "/" {
		return ""
	}
	return uuidFilePrefix.ReplaceAllString(base, "")
}

func NewContentResponse(c *models.Content) ContentResponse {
	var extra json.RawMessage
	if len(c.Extra) > 0 {
		extra = json.RawMessage(c.Extra)
	}
	return ContentResponse{
		ID:          c.ID.String(),
		Type:        string(c.Type),
		Title:       c.Title,
		Body:        c.Body,
		FileURL:     c.FileURL,
		FileName:    fileNameFromURL(c.FileURL),
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
