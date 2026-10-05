package repository

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
)

type QuizKindCount struct {
	Kind  string
	Count int64
}

type ExamStatusCount struct {
	Status string
	Count  int64
}

type DailyKindCount struct {
	Day   string
	Kind  string
	Count int64
}

type DailyCount struct {
	Day   string
	Count int64
}

type ActivityLogRow struct {
	ID          uuid.UUID
	Action      string
	ActorName   string
	TargetType  string
	TargetTitle string
	CreatedAt   time.Time
}

type DashboardRepository interface {
	CountQuizAttemptsByKind() ([]QuizKindCount, error)
	CountExamAttemptsByStatus() ([]ExamStatusCount, error)
	CountQuizAttemptsByBucket(since time.Time, bucket string) ([]DailyKindCount, error)
	CountExamAttemptsByBucket(since time.Time, bucket string) ([]DailyCount, error)
	RecentContentCreates(limit int) ([]ActivityLogRow, error)
	RecentNewsCreates(limit int) ([]ActivityLogRow, error)
	ListDeleteLogs(limit int) ([]models.AdminActivityLog, error)
	CreateActivityLog(item *models.AdminActivityLog) error
}

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) DashboardRepository {
	return &dashboardRepository{db: db}
}

func (r *dashboardRepository) CountQuizAttemptsByKind() ([]QuizKindCount, error) {
	var rows []QuizKindCount
	err := r.db.Table("quiz_attempts").
		Select("quizzes.kind AS kind, COUNT(*) AS count").
		Joins("JOIN quizzes ON quizzes.id = quiz_attempts.quiz_id").
		Group("quizzes.kind").
		Scan(&rows).Error
	return rows, err
}

func (r *dashboardRepository) CountExamAttemptsByStatus() ([]ExamStatusCount, error) {
	var rows []ExamStatusCount
	err := r.db.Table("exam_attempts").
		Select("status, COUNT(*) AS count").
		Group("status").
		Scan(&rows).Error
	return rows, err
}

func trendBucketSQL(bucket string) (trunc, layout string) {
	if bucket == "hour" {
		return "hour", "YYYY-MM-DD HH24:00"
	}
	return "day", "YYYY-MM-DD"
}

func (r *dashboardRepository) CountQuizAttemptsByBucket(since time.Time, bucket string) ([]DailyKindCount, error) {
	trunc, layout := trendBucketSQL(bucket)
	var rows []DailyKindCount
	err := r.db.Table("quiz_attempts").
		Select(fmt.Sprintf(
			`to_char(date_trunc('%s', quiz_attempts.completed_at AT TIME ZONE 'Asia/Bangkok'), '%s') AS day, quizzes.kind AS kind, COUNT(*) AS count`,
			trunc, layout,
		)).
		Joins("JOIN quizzes ON quizzes.id = quiz_attempts.quiz_id").
		Where("quiz_attempts.completed_at >= ?", since).
		Group("day, quizzes.kind").
		Order("day ASC").
		Scan(&rows).Error
	return rows, err
}

func (r *dashboardRepository) CountExamAttemptsByBucket(since time.Time, bucket string) ([]DailyCount, error) {
	trunc, layout := trendBucketSQL(bucket)
	var rows []DailyCount
	err := r.db.Table("exam_attempts").
		Select(fmt.Sprintf(
			`to_char(date_trunc('%s', COALESCE(exam_attempts.submitted_at, exam_attempts.started_at) AT TIME ZONE 'Asia/Bangkok'), '%s') AS day, COUNT(*) AS count`,
			trunc, layout,
		)).
		Where("COALESCE(exam_attempts.submitted_at, exam_attempts.started_at) >= ?", since).
		Group("day").
		Order("day ASC").
		Scan(&rows).Error
	return rows, err
}

func (r *dashboardRepository) RecentContentCreates(limit int) ([]ActivityLogRow, error) {
	var rows []ActivityLogRow
	err := r.db.Table("contents").
		Select(`contents.id,
			'create' AS action,
			COALESCE(
				NULLIF(BTRIM(users.display_name), ''),
				NULLIF(users.email, ''),
				NULLIF(BTRIM(staff.display_name), ''),
				NULLIF(staff.email, ''),
				'ระบบ'
			) AS actor_name,
			contents.type AS target_type,
			contents.title AS target_title,
			contents.created_at`).
		Joins("LEFT JOIN users ON users.id = contents.created_by").
		Joins(`LEFT JOIN LATERAL (
			SELECT display_name, email
			FROM users
			WHERE role IN ('admin', 'teacher')
			ORDER BY created_at ASC
			LIMIT 1
		) staff ON TRUE`).
		Order("contents.created_at DESC").
		Limit(limit).
		Scan(&rows).Error
	return rows, err
}

func (r *dashboardRepository) RecentNewsCreates(limit int) ([]ActivityLogRow, error) {
	var rows []ActivityLogRow
	err := r.db.Table("news").
		Select(`news.id,
			'create' AS action,
			COALESCE(
				NULLIF(BTRIM(users.display_name), ''),
				NULLIF(users.email, ''),
				NULLIF(BTRIM(staff.display_name), ''),
				NULLIF(staff.email, ''),
				'ระบบ'
			) AS actor_name,
			CASE WHEN news.audience = 'internal' THEN 'news_internal' ELSE 'news_external' END AS target_type,
			news.title AS target_title,
			news.created_at`).
		Joins("LEFT JOIN users ON users.id = news.created_by").
		Joins(`LEFT JOIN LATERAL (
			SELECT display_name, email
			FROM users
			WHERE role IN ('admin', 'teacher')
			ORDER BY created_at ASC
			LIMIT 1
		) staff ON TRUE`).
		Order("news.created_at DESC").
		Limit(limit).
		Scan(&rows).Error
	return rows, err
}

func (r *dashboardRepository) ListDeleteLogs(limit int) ([]models.AdminActivityLog, error) {
	var items []models.AdminActivityLog
	err := r.db.Where("action = ?", models.ActivityDelete).
		Order("created_at DESC").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *dashboardRepository) CreateActivityLog(item *models.AdminActivityLog) error {
	return r.db.Create(item).Error
}
