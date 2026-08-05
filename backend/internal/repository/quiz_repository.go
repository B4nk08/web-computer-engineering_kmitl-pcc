package repository

import (
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type QuizListFilter struct {
	Kind     *models.QuizKind
	IsActive *bool
}

type QuizRepository interface {
	CreateQuiz(quiz *models.Quiz) error
	FindQuizByID(id uuid.UUID) (*models.Quiz, error)
	ListQuizzes(filter QuizListFilter) ([]models.Quiz, error)
	UpdateQuiz(quiz *models.Quiz) error
	DeleteQuiz(id uuid.UUID) error

	CreateQuestion(q *models.QuizQuestion) error
	CreateOptions(opts []models.QuizOption) error
	FindQuestionByID(id uuid.UUID) (*models.QuizQuestion, error)
	ListQuestionsByQuizID(quizID uuid.UUID) ([]models.QuizQuestion, error)
	ListOptionsByQuestionIDs(questionIDs []uuid.UUID) ([]models.QuizOption, error)
	UpdateQuestion(q *models.QuizQuestion) error
	DeleteQuestion(id uuid.UUID) error
	DeleteOptionsByQuestionID(questionID uuid.UUID) error

	CreateAttempt(a *models.QuizAttempt) error
	ListAttemptsByQuizID(quizID uuid.UUID) ([]models.QuizAttempt, error)
}

type quizRepository struct {
	db *gorm.DB
}

func NewQuizRepository(db *gorm.DB) QuizRepository {
	return &quizRepository{db: db}
}

func (r *quizRepository) CreateQuiz(quiz *models.Quiz) error {
	return r.db.Create(quiz).Error
}

func (r *quizRepository) FindQuizByID(id uuid.UUID) (*models.Quiz, error) {
	var quiz models.Quiz
	if err := r.db.First(&quiz, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &quiz, nil
}

func (r *quizRepository) ListQuizzes(filter QuizListFilter) ([]models.Quiz, error) {
	q := r.db.Model(&models.Quiz{})
	if filter.Kind != nil {
		q = q.Where("kind = ?", *filter.Kind)
	}
	if filter.IsActive != nil {
		q = q.Where("is_active = ?", *filter.IsActive)
	}
	var items []models.Quiz
	if err := q.Order("title ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *quizRepository) UpdateQuiz(quiz *models.Quiz) error {
	return r.db.Save(quiz).Error
}

func (r *quizRepository) DeleteQuiz(id uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var questions []models.QuizQuestion
		if err := tx.Where("quiz_id = ?", id).Find(&questions).Error; err != nil {
			return err
		}
		for _, q := range questions {
			if err := tx.Where("question_id = ?", q.ID).Delete(&models.QuizOption{}).Error; err != nil {
				return err
			}
		}
		if err := tx.Where("quiz_id = ?", id).Delete(&models.QuizQuestion{}).Error; err != nil {
			return err
		}
		if err := tx.Where("quiz_id = ?", id).Delete(&models.QuizAttempt{}).Error; err != nil {
			return err
		}
		result := tx.Delete(&models.Quiz{}, "id = ?", id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return ErrNotFound
		}
		return nil
	})
}

func (r *quizRepository) CreateQuestion(q *models.QuizQuestion) error {
	return r.db.Create(q).Error
}

func (r *quizRepository) CreateOptions(opts []models.QuizOption) error {
	if len(opts) == 0 {
		return nil
	}
	return r.db.Create(&opts).Error
}

func (r *quizRepository) FindQuestionByID(id uuid.UUID) (*models.QuizQuestion, error) {
	var q models.QuizQuestion
	if err := r.db.First(&q, "id = ?", id).Error; err != nil {
		return nil, translate(err)
	}
	return &q, nil
}

func (r *quizRepository) ListQuestionsByQuizID(quizID uuid.UUID) ([]models.QuizQuestion, error) {
	var items []models.QuizQuestion
	if err := r.db.Where("quiz_id = ?", quizID).Order("sort_order ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *quizRepository) ListOptionsByQuestionIDs(questionIDs []uuid.UUID) ([]models.QuizOption, error) {
	if len(questionIDs) == 0 {
		return nil, nil
	}
	var items []models.QuizOption
	if err := r.db.Where("question_id IN ?", questionIDs).Order("sort_order ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *quizRepository) UpdateQuestion(q *models.QuizQuestion) error {
	return r.db.Save(q).Error
}

func (r *quizRepository) DeleteQuestion(id uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("question_id = ?", id).Delete(&models.QuizOption{}).Error; err != nil {
			return err
		}
		result := tx.Delete(&models.QuizQuestion{}, "id = ?", id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return ErrNotFound
		}
		return nil
	})
}

func (r *quizRepository) DeleteOptionsByQuestionID(questionID uuid.UUID) error {
	return r.db.Where("question_id = ?", questionID).Delete(&models.QuizOption{}).Error
}

func (r *quizRepository) CreateAttempt(a *models.QuizAttempt) error {
	return r.db.Create(a).Error
}

func (r *quizRepository) ListAttemptsByQuizID(quizID uuid.UUID) ([]models.QuizAttempt, error) {
	var items []models.QuizAttempt
	if err := r.db.Where("quiz_id = ?", quizID).Order("completed_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
