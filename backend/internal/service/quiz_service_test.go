package service

import (
	"testing"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/datatypes"
)

func TestBuildExternalResult(t *testing.T) {
	q1 := uuid.New()
	q2 := uuid.New()
	high := uuid.New()
	low := uuid.New()
	mid := uuid.New()
	fair := uuid.New()

	questions := []models.QuizQuestion{{ID: q1}, {ID: q2}}
	options := []models.QuizOption{
		{ID: high, QuestionID: q1, ScoreMap: datatypes.JSON(`{"readiness":3}`)},
		{ID: low, QuestionID: q1, ScoreMap: datatypes.JSON(`{"readiness":0}`)},
		{ID: mid, QuestionID: q2, ScoreMap: datatypes.JSON(`{"readiness":2}`)},
		{ID: fair, QuestionID: q2, ScoreMap: datatypes.JSON(`{"readiness":1}`)},
	}
	optByID := map[string]models.QuizOption{}
	for _, option := range options {
		optByID[option.ID.String()] = option
	}

	full := buildExternalResult(questions, options, map[string]string{
		q1.String(): high.String(),
		q2.String(): mid.String(),
	}, optByID, 2)
	if full.Score != 5 || full.MaxScore != 5 || full.Percent != 100 || full.Band != "high" {
		t.Fatalf("full readiness: %+v", full)
	}

	weak := buildExternalResult(questions, options, map[string]string{
		q1.String(): low.String(),
		q2.String(): fair.String(),
	}, optByID, 2)
	if weak.Score != 1 || weak.MaxScore != 5 || weak.Percent != 20 || weak.Band != "low" {
		t.Fatalf("weak readiness: %+v", weak)
	}
}

func TestPlaySize(t *testing.T) {
	cases := []struct {
		configured, bank, want int
	}{
		{0, 30, 30},
		{10, 30, 10},
		{30, 30, 30},
		{40, 30, 30},
		{10, 0, 0},
		{-1, 12, 12},
	}
	for _, tc := range cases {
		got := playSize(tc.configured, tc.bank)
		if got != tc.want {
			t.Fatalf("playSize(%d, %d) = %d, want %d", tc.configured, tc.bank, got, tc.want)
		}
	}
}
