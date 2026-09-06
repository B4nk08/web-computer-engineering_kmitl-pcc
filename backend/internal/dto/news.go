package dto

import (
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// CreateNewsRequest สร้างข่าวสาร
type CreateNewsRequest struct {
	Audience    string `json:"audience" binding:"required"` // external | internal
	Title       string `json:"title" binding:"required"`
	Body        string `json:"body"`
	ImageURL    string `json:"image_url"`
	IsPublished *bool  `json:"is_published"`
}

// UpdateNewsRequest อัปเดตข่าวสาร (ทุกฟิลด์ optional)
type UpdateNewsRequest struct {
	Audience    *string `json:"audience"`
	Title       *string `json:"title"`
	Body        *string `json:"body"`
	ImageURL    *string `json:"image_url"`
	IsPublished *bool   `json:"is_published"`
}

// NewsFilter ค่าจาก query string สำหรับ list
type NewsFilter struct {
	Audience      string `form:"audience"`       // external | internal
	IsPublished   *bool  `form:"is_published"`
	PublishedOnly bool   `form:"published_only"` // true = เฉพาะที่เผยแพร่แล้ว
}

// NewsResponse ข้อมูลข่าวสารที่ส่งกลับ client
type NewsResponse struct {
	ID          string     `json:"id"`
	Audience    string     `json:"audience"`
	Title       string     `json:"title"`
	Body        string     `json:"body"`
	ImageURL    string     `json:"image_url"`
	IsPublished bool       `json:"is_published"`
	PublishedAt *time.Time `json:"published_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

func NewNewsResponse(n *models.News) NewsResponse {
	return NewsResponse{
		ID:          n.ID.String(),
		Audience:    string(n.Audience),
		Title:       n.Title,
		Body:        n.Body,
		ImageURL:    n.ImageURL,
		IsPublished: n.IsPublished,
		PublishedAt: n.PublishedAt,
		CreatedAt:   n.CreatedAt,
		UpdatedAt:   n.UpdatedAt,
	}
}

func NewNewsListResponse(items []models.News) []NewsResponse {
	out := make([]NewsResponse, 0, len(items))
	for i := range items {
		out = append(out, NewNewsResponse(&items[i]))
	}
	return out
}
