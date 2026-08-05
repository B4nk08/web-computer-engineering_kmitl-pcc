package repository

import (
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type ExamQuestionListFilter struct {
	Subject  *models.TrackGroup
	Mode     *models.ExamMode
	IsActive *bool
}

type ExamRepository interface {
	CreateQuestion(q *models.ExamQuestion) error
	FindQuestionByID(id uuid.UUID) (*models.ExamQuestion, error)
	ListQuestions(filter ExamQuestionListFilter) ([]models.ExamQuestion, error)
	ListActiveQuestions(subject models.TrackGroup, mode models.ExamMode) ([]models.ExamQuestion, error)
	UpdateQuestion(q *models.ExamQuestion) error
	DeleteQuestion(id uuid.UUID) error

	CreateSetting(s *models.ExamSetting) error
	UpdateSetting(s *models.ExamSetting) error
	FindSetting(subject models.TrackGroup, mode models.ExamMode) (*models.ExamSetting, error)
	ListSettings() ([]models.ExamSetting, error)

	CreateCredential(c *models.ExamCredential) error
	FindCredentialByUsername(username string) (*models.ExamCredential, error)
	UpdateCredential(c *models.ExamCredential) error
	ListCredentials(subject *models.TrackGroup) ([]models.ExamCredential, error)

	CreateAttempt(a *models.ExamAttempt) error
	FindAttemptByID(id uuid.UUID) (*models.ExamAttempt, error)
	UpdateAttempt(a *models.ExamAttempt) error
	ListAttempts(subject *models.TrackGroup, mode *models.ExamMode) ([]models.ExamAttempt, error)
}

type examRepository struct {
	db *gorm.DB
}

func NewExamRepository(db *gorm.DB) ExamRepository {
	return &examRepository{db: db}
}

func (r *examRepository) CreateQuestion(q *models.ExamQuestion) error {
	return r.db.Create(q).Error
}

func (r *examRepository) FindQuestionByID(id uuid.UUID) (*models.ExamQuestion, error) {
	var q models.ExamQuestion
	if err := r.db.First(&q, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &q, nil
}

func (r *examRepository) ListQuestions(filter ExamQuestionListFilter) ([]models.ExamQuestion, error) {
	q := r.db.Model(&models.ExamQuestion{})
	if filter.Subject != nil {
		q = q.Where("subject = ?", *filter.Subject)
	}
	if filter.Mode != nil {
		q = q.Where("mode = ?", *filter.Mode)
	}
	if filter.IsActive != nil {
		q = q.Where("is_active = ?", *filter.IsActive)
	}
	var items []models.ExamQuestion
	if err := q.Order("created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *examRepository) ListActiveQuestions(subject models.TrackGroup, mode models.ExamMode) ([]models.ExamQuestion, error) {
	var items []models.ExamQuestion
	if err := r.db.Where("subject = ? AND mode = ? AND is_active = true", subject, mode).
		Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *examRepository) UpdateQuestion(q *models.ExamQuestion) error {
	return r.db.Save(q).Error
}

func (r *examRepository) DeleteQuestion(id uuid.UUID) error {
	result := r.db.Delete(&models.ExamQuestion{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *examRepository) CreateSetting(s *models.ExamSetting) error {
	return r.db.Create(s).Error
}

func (r *examRepository) UpdateSetting(s *models.ExamSetting) error {
	return r.db.Save(s).Error
}

func (r *examRepository) FindSetting(subject models.TrackGroup, mode models.ExamMode) (*models.ExamSetting, error) {
	var s models.ExamSetting
	if err := r.db.Where("subject = ? AND mode = ?", subject, mode).First(&s).Error; err != nil {
		return nil, translate(err)
	}
	return &s, nil
}

func (r *examRepository) ListSettings() ([]models.ExamSetting, error) {
	var items []models.ExamSetting
	if err := r.db.Order("subject ASC, mode ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *examRepository) CreateCredential(c *models.ExamCredential) error {
	return r.db.Create(c).Error
}

func (r *examRepository) FindCredentialByUsername(username string) (*models.ExamCredential, error) {
	var c models.ExamCredential
	if err := r.db.Where("username = ?", username).First(&c).Error; err != nil {
		return nil, translate(err)
	}
	return &c, nil
}

func (r *examRepository) UpdateCredential(c *models.ExamCredential) error {
	return r.db.Save(c).Error
}

func (r *examRepository) ListCredentials(subject *models.TrackGroup) ([]models.ExamCredential, error) {
	q := r.db.Model(&models.ExamCredential{})
	if subject != nil {
		q = q.Where("subject = ?", *subject)
	}
	var items []models.ExamCredential
	if err := q.Order("created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *examRepository) CreateAttempt(a *models.ExamAttempt) error {
	return r.db.Create(a).Error
}

func (r *examRepository) FindAttemptByID(id uuid.UUID) (*models.ExamAttempt, error) {
	var a models.ExamAttempt
	if err := r.db.First(&a, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &a, nil
}

func (r *examRepository) UpdateAttempt(a *models.ExamAttempt) error {
	return r.db.Save(a).Error
}

func (r *examRepository) ListAttempts(subject *models.TrackGroup, mode *models.ExamMode) ([]models.ExamAttempt, error) {
	q := r.db.Model(&models.ExamAttempt{})
	if subject != nil {
		q = q.Where("subject = ?", *subject)
	}
	if mode != nil {
		q = q.Where("mode = ?", *mode)
	}
	var items []models.ExamAttempt
	if err := q.Order("started_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
