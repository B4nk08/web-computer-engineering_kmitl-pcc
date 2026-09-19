package repository

import (
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type CareerClusterRepository interface {
	ListActive() ([]models.CareerCluster, error)
	FindByCode(code string) (*models.CareerCluster, error)
}

type careerClusterRepository struct {
	db *gorm.DB
}

func NewCareerClusterRepository(db *gorm.DB) CareerClusterRepository {
	return &careerClusterRepository{db: db}
}

func (r *careerClusterRepository) ListActive() ([]models.CareerCluster, error) {
	var items []models.CareerCluster
	if err := r.db.Where("is_active = ?", true).Order("sort_order ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *careerClusterRepository) FindByCode(code string) (*models.CareerCluster, error) {
	var item models.CareerCluster
	if err := r.db.Where("code = ? AND is_active = ?", code, true).First(&item).Error; err != nil {
		return nil, translate(err)
	}
	return &item, nil
}
