package repository

import (
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type WhitelistRepository interface {
	// FindByEmail หา entry ใน ce_whitelist ตามอีเมล (คืน ErrNotFound ถ้าไม่มี)
	FindByEmail(email string) (*models.CEWhitelist, error)
}

type whitelistRepository struct {
	db *gorm.DB
}

func NewWhitelistRepository(db *gorm.DB) WhitelistRepository {
	return &whitelistRepository{db: db}
}

func (r *whitelistRepository) FindByEmail(email string) (*models.CEWhitelist, error) {
	var entry models.CEWhitelist
	if err := r.db.Where("email = ?", email).First(&entry).Error; err != nil {
		return nil, translate(err)
	}
	return &entry, nil
}
