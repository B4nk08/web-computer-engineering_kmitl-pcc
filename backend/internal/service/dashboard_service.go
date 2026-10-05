package service

import (
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

type ActivityRecorder interface {
	RecordDelete(targetType, title, actorName string, actorID *uuid.UUID) error
}

type DashboardService interface {
	ActivityRecorder
	Get(rangeKey string) (*dto.DashboardResponse, error)
	ListLogs(limit int) ([]dto.DashboardActivityLog, error)
}

type dashboardService struct {
	dashboard repository.DashboardRepository
}

func NewDashboardService(dashboard repository.DashboardRepository) DashboardService {
	return &dashboardService{dashboard: dashboard}
}

func (s *dashboardService) RecordDelete(targetType, title, actorName string, actorID *uuid.UUID) error {
	name := actorName
	if name == "" {
		name = "แอดมิน"
	}
	return s.dashboard.CreateActivityLog(&models.AdminActivityLog{
		Action:      models.ActivityDelete,
		TargetType:  targetType,
		TargetTitle: title,
		ActorName:   name,
		ActorID:     actorID,
	})
}

func (s *dashboardService) Get(rangeKey string) (*dto.DashboardResponse, error) {
	kindCounts, err := s.dashboard.CountQuizAttemptsByKind()
	if err != nil {
		return nil, err
	}
	var externalQuiz, internalQuiz int64
	for _, row := range kindCounts {
		switch models.QuizKind(row.Kind) {
		case models.QuizExternal:
			externalQuiz = row.Count
		case models.QuizInternal:
			internalQuiz = row.Count
		}
	}

	statusCounts, err := s.dashboard.CountExamAttemptsByStatus()
	if err != nil {
		return nil, err
	}
	var examStarted, examSubmitted int64
	for _, row := range statusCounts {
		examStarted += row.Count
		if models.AttemptStatus(row.Status) == models.AttemptSubmitted {
			examSubmitted = row.Count
		}
	}

	trend, err := s.usageTrend(rangeKey)
	if err != nil {
		return nil, err
	}

	return &dto.DashboardResponse{
		ExternalQuizPlays: externalQuiz,
		InternalQuizPlays: internalQuiz,
		ExamStarted:       examStarted,
		ExamSubmitted:     examSubmitted,
		Trend:             trend,
	}, nil
}

func (s *dashboardService) ListLogs(limit int) ([]dto.DashboardActivityLog, error) {
	if limit <= 0 || limit > 100 {
		limit = 80
	}
	creates, err := s.recentCreates(limit)
	if err != nil {
		return nil, err
	}
	deletes, err := s.dashboard.ListDeleteLogs(limit)
	if err != nil {
		return nil, err
	}
	return mergeLogs(creates, deletes, limit), nil
}

func (s *dashboardService) usageTrend(rangeKey string) ([]dto.DashboardTrendPoint, error) {
	bucket, points := trendWindow(rangeKey)
	loc := bangkokLocation()
	now := time.Now().In(loc)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)

	var since time.Time
	var end time.Time
	var step func(time.Time) time.Time
	if bucket == "hour" {
		since = today
		end = time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), 0, 0, 0, loc)
		step = func(t time.Time) time.Time { return t.Add(time.Hour) }
	} else {
		since = today.AddDate(0, 0, -(points - 1))
		end = today
		step = func(t time.Time) time.Time { return t.AddDate(0, 0, 1) }
	}

	quizDays, err := s.dashboard.CountQuizAttemptsByBucket(since, bucket)
	if err != nil {
		return nil, err
	}
	examDays, err := s.dashboard.CountExamAttemptsByBucket(since, bucket)
	if err != nil {
		return nil, err
	}

	quizExt := map[string]int64{}
	quizInt := map[string]int64{}
	examMap := map[string]int64{}
	for _, row := range quizDays {
		if models.QuizKind(row.Kind) == models.QuizInternal {
			quizInt[row.Day] = row.Count
		} else {
			quizExt[row.Day] += row.Count
		}
	}
	for _, row := range examDays {
		examMap[row.Day] = row.Count
	}

	months := []string{"ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."}
	trend := make([]dto.DashboardTrendPoint, 0, points)
	for cursor := since; !cursor.After(end); cursor = step(cursor) {
		var key, label string
		if bucket == "hour" {
			key = cursor.Format("2006-01-02 15:00")
			label = cursor.Format("15:04")
		} else {
			key = cursor.Format("2006-01-02")
			label = cursor.Format("2") + " " + months[cursor.Month()-1]
		}
		trend = append(trend, dto.DashboardTrendPoint{
			Date:         label,
			ExternalQuiz: quizExt[key],
			InternalQuiz: quizInt[key],
			Exam:         examMap[key],
		})
	}
	return trend, nil
}

func trendWindow(rangeKey string) (bucket string, points int) {
	switch rangeKey {
	case "1d":
		return "hour", 24
	case "30d":
		return "day", 30
	case "90d":
		return "day", 90
	default:
		return "day", 7
	}
}

func bangkokLocation() *time.Location {
	loc, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		return time.FixedZone("ICT", 7*60*60)
	}
	return loc
}

func (s *dashboardService) recentCreates(limit int) ([]dto.DashboardActivityLog, error) {
	contents, err := s.dashboard.RecentContentCreates(limit)
	if err != nil {
		return nil, err
	}
	news, err := s.dashboard.RecentNewsCreates(limit)
	if err != nil {
		return nil, err
	}
	out := make([]dto.DashboardActivityLog, 0, len(contents)+len(news))
	for _, row := range contents {
		out = append(out, dto.DashboardActivityLog{
			ID:          row.ID.String(),
			Action:      row.Action,
			ActorName:   row.ActorName,
			TargetType:  contentTypeLabel(row.TargetType),
			TargetTitle: row.TargetTitle,
			CreatedAt:   row.CreatedAt,
		})
	}
	for _, row := range news {
		out = append(out, dto.DashboardActivityLog{
			ID:          row.ID.String(),
			Action:      row.Action,
			ActorName:   row.ActorName,
			TargetType:  contentTypeLabel(row.TargetType),
			TargetTitle: row.TargetTitle,
			CreatedAt:   row.CreatedAt,
		})
	}
	return out, nil
}

func mergeLogs(creates []dto.DashboardActivityLog, deletes []models.AdminActivityLog, limit int) []dto.DashboardActivityLog {
	out := append([]dto.DashboardActivityLog{}, creates...)
	for _, item := range deletes {
		out = append(out, dto.DashboardActivityLog{
			ID:          item.ID.String(),
			Action:      string(item.Action),
			ActorName:   item.ActorName,
			TargetType:  contentTypeLabel(item.TargetType),
			TargetTitle: item.TargetTitle,
			CreatedAt:   item.CreatedAt,
		})
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].CreatedAt.After(out[j].CreatedAt)
	})
	if len(out) > limit {
		return out[:limit]
	}
	return out
}

func contentTypeLabel(raw string) string {
	switch raw {
	case string(models.ContentStaff):
		return "คณาจารย์ / บุคลากร"
	case string(models.ContentStudentWork):
		return "ผลงานนักศึกษา"
	case string(models.ContentVideo):
		return "วิดีโอหน้าแรก"
	case string(models.ContentCareerPath):
		return "เส้นทางอาชีพ"
	case string(models.ContentAdmissions):
		return "ข้อมูลรับสมัคร"
	case string(models.ContentCurriculum):
		return "หลักสูตร"
	case string(models.ContentActivity):
		return "กิจกรรม"
	case string(models.ContentPage):
		return "หน้าเว็บ"
	case "news_internal":
		return "ข่าวสารภายในสาขา"
	case "news_external":
		return "ข่าวสารรับสมัคร"
	case "news":
		return "ข่าวสาร"
	default:
		if raw == "" {
			return "เนื้อหา"
		}
		return raw
	}
}
