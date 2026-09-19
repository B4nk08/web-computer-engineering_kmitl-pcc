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
	if err := db.AutoMigrate(models.All()...); err != nil {
		return err
	}
	// AutoMigrate ไม่ลด NOT NULL ของคอลัมน์เดิม — อนุญาต anonymous quiz attempt
	_ = db.Exec(`ALTER TABLE quiz_attempts ALTER COLUMN user_id DROP NOT NULL`).Error
	return seedExamSubjects(db)
}

func seedExamSubjects(db *gorm.DB) error {
	defaults := []models.ExamSubject{
		{Code: "iot", Name: "IoT", Description: "Internet of Things", SortOrder: 1, IsActive: true},
		{Code: "software", Name: "Software", Description: "Software", SortOrder: 2, IsActive: true},
		{Code: "network", Name: "Network", Description: "Computer Networks", SortOrder: 3, IsActive: true},
		{Code: "programming", Name: "Programming", Description: "Programming", SortOrder: 4, IsActive: true},
	}
	for _, item := range defaults {
		subject := models.ExamSubject{Code: item.Code}
		if err := db.Where(models.ExamSubject{Code: item.Code}).
			Attrs(item).
			FirstOrCreate(&subject).Error; err != nil {
			return err
		}
	}
	return nil
}
