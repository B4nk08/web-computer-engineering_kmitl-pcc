package database

import (
	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg config.Config) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.CEWhitelist{},
	)
}
