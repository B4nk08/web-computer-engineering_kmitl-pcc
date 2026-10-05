package dto

import "time"

type DashboardTrendPoint struct {
	Date         string `json:"date"`
	ExternalQuiz int64  `json:"external_quiz"`
	InternalQuiz int64  `json:"internal_quiz"`
	Exam         int64  `json:"exam"`
}

type DashboardActivityLog struct {
	ID          string    `json:"id"`
	Action      string    `json:"action"`
	ActorName   string    `json:"actor_name"`
	TargetType  string    `json:"target_type"`
	TargetTitle string    `json:"target_title"`
	CreatedAt   time.Time `json:"created_at"`
}

type DashboardResponse struct {
	ExternalQuizPlays int64                   `json:"external_quiz_plays"`
	InternalQuizPlays int64                   `json:"internal_quiz_plays"`
	ExamStarted       int64                   `json:"exam_started"`
	ExamSubmitted     int64                   `json:"exam_submitted"`
	Trend             []DashboardTrendPoint  `json:"trend"`
}
