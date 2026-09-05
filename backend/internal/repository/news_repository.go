package repository

import (
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type NewsListFilter struct {
	Audience    *models.NewsAudience
	IsPublished *bool
}

type NewsRepository interface {
	Create(news *models.News) error
	FindByID(id uuid.UUID) (*models.News, error)
	List(filter NewsListFilter) ([]models.News, error)
	Update(news *models.News) error
	Delete(id uuid.UUID) error
}

type newsRepository struct {
	db *gorm.DB
}

func NewNewsRepository(db *gorm.DB) NewsRepository {
	return &newsRepository{db: db}
}

func (r *newsRepository) Create(news *models.News) error {
	return r.db.Create(news).Error
}

func (r *newsRepository) FindByID(id uuid.UUID) (*models.News, error) {
	var news models.News
	if err := r.db.First(&news, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &news, nil
}

func (r *newsRepository) List(filter NewsListFilter) ([]models.News, error) {
	q := r.db.Model(&models.News{})

	if filter.Audience != nil {
		q = q.Where("audience = ?", *filter.Audience)
	}
	if filter.IsPublished != nil {
		q = q.Where("is_published = ?", *filter.IsPublished)
	}

	var items []models.News
	if err := q.Order("published_at DESC NULLS LAST, created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *newsRepository) Update(news *models.News) error {
	return r.db.Save(news).Error
}

func (r *newsRepository) Delete(id uuid.UUID) error {
	result := r.db.Delete(&models.News{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
