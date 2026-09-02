// Package repository เป็นชั้นเข้าถึงข้อมูล (data access) แยกจาก business logic
package repository

import (
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

// ErrNotFound ใช้แทน record ที่หาไม่เจอ (ซ่อนรายละเอียดของ gorm)
var ErrNotFound = errors.New("record not found")

// ErrDuplicate ใช้แทนกรณี unique constraint ชน (เช่น email ซ้ำ)
var ErrDuplicate = errors.New("duplicate record")

type UserRepository interface {
	FindByEmail(email string) (*models.User, error)
	FindByGoogleSub(sub string) (*models.User, error)
	FindByID(id uuid.UUID) (*models.User, error)
	Create(user *models.User) error
	Update(user *models.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, translate(err)
	}
	return &user, nil
}

func (r *userRepository) FindByGoogleSub(sub string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("google_sub = ?", sub).First(&user).Error; err != nil {
		return nil, translate(err)
	}
	return &user, nil
}

func (r *userRepository) FindByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &user, nil
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

// translate แปลง error ของ gorm เป็น error กลางของเรา
func translate(err error) error {
	if err == nil {
		return nil
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrNotFound
	}
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return ErrDuplicate
	}
	// fallback: Postgres unique_violation (SQLSTATE 23505) กรณี TranslateError ยังไม่ทำงาน
	msg := err.Error()
	if strings.Contains(msg, "SQLSTATE 23505") || strings.Contains(msg, "duplicate key") {
		return ErrDuplicate
	}
	return err
}
