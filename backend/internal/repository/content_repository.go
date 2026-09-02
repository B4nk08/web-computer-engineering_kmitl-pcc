package repository

import (
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

// ContentListFilter เงื่อนไขค้นหาใน DB
type ContentListFilter struct {
	Type        *models.ContentType
	IsPublished *bool
}

type ContentRepository interface {
	Create(content *models.Content) error
	FindByID(id uuid.UUID) (*models.Content, error)
	List(filter ContentListFilter) ([]models.Content, error)
	Update(content *models.Content) error
	Delete(id uuid.UUID) error
}

type contentRepository struct {
	db *gorm.DB
}

func NewContentRepository(db *gorm.DB) ContentRepository {
	return &contentRepository{db: db}
}

func (r *contentRepository) Create(content *models.Content) error {
	return r.db.Create(content).Error
}

func (r *contentRepository) FindByID(id uuid.UUID) (*models.Content, error) {
	var content models.Content
	if err := r.db.First(&content, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &content, nil
}

func (r *contentRepository) List(filter ContentListFilter) ([]models.Content, error) {
	q := r.db.Model(&models.Content{})

	if filter.Type != nil {
		q = q.Where("type = ?", *filter.Type)
	}
	if filter.IsPublished != nil {
		q = q.Where("is_published = ?", *filter.IsPublished)
	}

	var items []models.Content
	if err := q.Order("sort_order ASC, created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *contentRepository) Update(content *models.Content) error {
	return r.db.Save(content).Error
}

func (r *contentRepository) Delete(id uuid.UUID) error {
	result := r.db.Delete(&models.Content{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
