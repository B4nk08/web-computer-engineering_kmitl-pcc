package service

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"gorm.io/datatypes"
)

var (
	ErrInvalidQuizKind   = errors.New("invalid quiz kind")
	ErrQuizNotFound      = errors.New("quiz not found")
	ErrQuizQuestionNotFound = errors.New("quiz question not found")
	ErrQuizInactive      = errors.New("quiz is inactive")
)

type QuizService interface {
	CreateQuiz(req dto.CreateQuizRequest) (*dto.QuizResponse, error)
	ListQuizzes(filter dto.QuizFilter) ([]dto.QuizResponse, error)
	GetQuizAdmin(id uuid.UUID) (*dto.QuizDetailAdminResponse, error)
	GetQuizPlay(id uuid.UUID) (*dto.QuizPlayResponse, error)
	UpdateQuiz(id uuid.UUID, req dto.UpdateQuizRequest) (*dto.QuizResponse, error)
	DeleteQuiz(id uuid.UUID) error

	AddQuestion(quizID uuid.UUID, req dto.CreateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error)
	UpdateQuestion(id uuid.UUID, req dto.UpdateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error)
	DeleteQuestion(id uuid.UUID) error

	SubmitAttempt(quizID uuid.UUID, userID *uuid.UUID, req dto.SubmitQuizAttemptRequest) (*dto.QuizAttemptResponse, error)
	ListAttempts(quizID uuid.UUID) ([]dto.QuizAttemptResponse, error)
}

type quizService struct {
	quizzes repository.QuizRepository
}

func NewQuizService(quizzes repository.QuizRepository) QuizService {
	return &quizService{quizzes: quizzes}
}

func parseQuizKind(v string) (models.QuizKind, error) {
	switch models.QuizKind(v) {
	case models.QuizExternal, models.QuizInternal:
		return models.QuizKind(v), nil
	default:
		return "", ErrInvalidQuizKind
	}
}

func (s *quizService) CreateQuiz(req dto.CreateQuizRequest) (*dto.QuizResponse, error) {
	kind, err := parseQuizKind(req.Kind)
	if err != nil {
		return nil, err
	}
	active := true
	if req.IsActive != nil {
		active = *req.IsActive
	}
	quiz := &models.Quiz{
		Kind:        kind,
		Title:       req.Title,
		Description: req.Description,
		IsActive:    active,
	}
	if err := s.quizzes.CreateQuiz(quiz); err != nil {
		return nil, err
	}
	res := dto.NewQuizResponse(quiz)
	return &res, nil
}

func (s *quizService) ListQuizzes(filter dto.QuizFilter) ([]dto.QuizResponse, error) {
	repoFilter := repository.QuizListFilter{}
	if filter.Kind != "" {
		kind, err := parseQuizKind(filter.Kind)
		if err != nil {
			return nil, err
		}
		repoFilter.Kind = &kind
	}
	repoFilter.IsActive = filter.IsActive

	items, err := s.quizzes.ListQuizzes(repoFilter)
	if err != nil {
		return nil, err
	}
	out := make([]dto.QuizResponse, 0, len(items))
	for i := range items {
		out = append(out, dto.NewQuizResponse(&items[i]))
	}
	return out, nil
}

func (s *quizService) loadQuestionsAdmin(quizID uuid.UUID) ([]dto.QuizQuestionAdmin, error) {
	questions, err := s.quizzes.ListQuestionsByQuizID(quizID)
	if err != nil {
		return nil, err
	}
	ids := make([]uuid.UUID, 0, len(questions))
	for _, q := range questions {
		ids = append(ids, q.ID)
	}
	options, err := s.quizzes.ListOptionsByQuestionIDs(ids)
	if err != nil {
		return nil, err
	}
	byQ := map[uuid.UUID][]dto.QuizOptionAdmin{}
	for _, o := range options {
		byQ[o.QuestionID] = append(byQ[o.QuestionID], dto.QuizOptionAdmin{
			ID:        o.ID.String(),
			Label:     o.Label,
			ScoreMap:  json.RawMessage(o.ScoreMap),
			SortOrder: o.SortOrder,
		})
	}
	out := make([]dto.QuizQuestionAdmin, 0, len(questions))
	for _, q := range questions {
		out = append(out, dto.QuizQuestionAdmin{
			ID:        q.ID.String(),
			Prompt:    q.Prompt,
			ImageURL:  q.ImageURL,
			SortOrder: q.SortOrder,
			Options:   byQ[q.ID],
		})
	}
	return out, nil
}

func (s *quizService) GetQuizAdmin(id uuid.UUID) (*dto.QuizDetailAdminResponse, error) {
	quiz, err := s.quizzes.FindQuizByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	questions, err := s.loadQuestionsAdmin(id)
	if err != nil {
		return nil, err
	}
	return &dto.QuizDetailAdminResponse{
		Quiz:      dto.NewQuizResponse(quiz),
		Questions: questions,
	}, nil
}

func (s *quizService) GetQuizPlay(id uuid.UUID) (*dto.QuizPlayResponse, error) {
	quiz, err := s.quizzes.FindQuizByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	if !quiz.IsActive {
		return nil, ErrQuizInactive
	}
	adminQs, err := s.loadQuestionsAdmin(id)
	if err != nil {
		return nil, err
	}
	publicQs := make([]dto.QuizQuestionPublic, 0, len(adminQs))
	for _, q := range adminQs {
		opts := make([]dto.QuizOptionPublic, 0, len(q.Options))
		for _, o := range q.Options {
			opts = append(opts, dto.QuizOptionPublic{
				ID:        o.ID,
				Label:     o.Label,
				SortOrder: o.SortOrder,
			})
		}
		publicQs = append(publicQs, dto.QuizQuestionPublic{
			ID:        q.ID,
			Prompt:    q.Prompt,
			ImageURL:  q.ImageURL,
			SortOrder: q.SortOrder,
			Options:   opts,
		})
	}
	return &dto.QuizPlayResponse{
		Quiz:      dto.NewQuizResponse(quiz),
		Questions: publicQs,
	}, nil
}

func (s *quizService) UpdateQuiz(id uuid.UUID, req dto.UpdateQuizRequest) (*dto.QuizResponse, error) {
	quiz, err := s.quizzes.FindQuizByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	if req.Title != nil {
		quiz.Title = *req.Title
	}
	if req.Description != nil {
		quiz.Description = *req.Description
	}
	if req.IsActive != nil {
		quiz.IsActive = *req.IsActive
	}
	if err := s.quizzes.UpdateQuiz(quiz); err != nil {
		return nil, err
	}
	res := dto.NewQuizResponse(quiz)
	return &res, nil
}

func (s *quizService) DeleteQuiz(id uuid.UUID) error {
	if err := s.quizzes.DeleteQuiz(id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrQuizNotFound
		}
		return err
	}
	return nil
}

func (s *quizService) AddQuestion(quizID uuid.UUID, req dto.CreateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error) {
	if _, err := s.quizzes.FindQuizByID(quizID); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	q := &models.QuizQuestion{
		QuizID:    quizID,
		Prompt:    req.Prompt,
		ImageURL:  req.ImageURL,
		SortOrder: req.SortOrder,
	}
	if err := s.quizzes.CreateQuestion(q); err != nil {
		return nil, err
	}
	opts := make([]models.QuizOption, 0, len(req.Options))
	adminOpts := make([]dto.QuizOptionAdmin, 0, len(req.Options))
	for _, o := range req.Options {
		opt := models.QuizOption{
			QuestionID: q.ID,
			Label:      o.Label,
			ScoreMap:   datatypes.JSON(o.ScoreMap),
			SortOrder:  o.SortOrder,
		}
		opts = append(opts, opt)
	}
	if err := s.quizzes.CreateOptions(opts); err != nil {
		return nil, err
	}
	for _, o := range opts {
		adminOpts = append(adminOpts, dto.QuizOptionAdmin{
			ID:        o.ID.String(),
			Label:     o.Label,
			ScoreMap:  json.RawMessage(o.ScoreMap),
			SortOrder: o.SortOrder,
		})
	}
	return &dto.QuizQuestionAdmin{
		ID:        q.ID.String(),
		Prompt:    q.Prompt,
		ImageURL:  q.ImageURL,
		SortOrder: q.SortOrder,
		Options:   adminOpts,
	}, nil
}

func (s *quizService) UpdateQuestion(id uuid.UUID, req dto.UpdateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error) {
	q, err := s.quizzes.FindQuestionByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizQuestionNotFound
		}
		return nil, err
	}
	if req.Prompt != nil {
		q.Prompt = *req.Prompt
	}
	if req.ImageURL != nil {
		q.ImageURL = *req.ImageURL
	}
	if req.SortOrder != nil {
		q.SortOrder = *req.SortOrder
	}
	if err := s.quizzes.UpdateQuestion(q); err != nil {
		return nil, err
	}
	options, err := s.quizzes.ListOptionsByQuestionIDs([]uuid.UUID{q.ID})
	if err != nil {
		return nil, err
	}
	adminOpts := make([]dto.QuizOptionAdmin, 0, len(options))
	for _, o := range options {
		adminOpts = append(adminOpts, dto.QuizOptionAdmin{
			ID:        o.ID.String(),
			Label:     o.Label,
			ScoreMap:  json.RawMessage(o.ScoreMap),
			SortOrder: o.SortOrder,
		})
	}
	return &dto.QuizQuestionAdmin{
		ID:        q.ID.String(),
		Prompt:    q.Prompt,
		ImageURL:  q.ImageURL,
		SortOrder: q.SortOrder,
		Options:   adminOpts,
	}, nil
}

func (s *quizService) DeleteQuestion(id uuid.UUID) error {
	if err := s.quizzes.DeleteQuestion(id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrQuizQuestionNotFound
		}
		return err
	}
	return nil
}

func (s *quizService) SubmitAttempt(quizID uuid.UUID, userID *uuid.UUID, req dto.SubmitQuizAttemptRequest) (*dto.QuizAttemptResponse, error) {
	quiz, err := s.quizzes.FindQuizByID(quizID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	if !quiz.IsActive {
		return nil, ErrQuizInactive
	}

	questions, err := s.quizzes.ListQuestionsByQuizID(quizID)
	if err != nil {
		return nil, err
	}
	qIDs := make([]uuid.UUID, 0, len(questions))
	for _, q := range questions {
		qIDs = append(qIDs, q.ID)
	}
	options, err := s.quizzes.ListOptionsByQuestionIDs(qIDs)
	if err != nil {
		return nil, err
	}
	optByID := map[string]models.QuizOption{}
	for _, o := range options {
		optByID[o.ID.String()] = o
	}

	scores := map[string]float64{
		string(models.TrackIoT):         0,
		string(models.TrackSoftware):    0,
		string(models.TrackNetwork):     0,
		string(models.TrackProgramming): 0,
	}
	answered := 0
	for _, optID := range req.Answers {
		opt, ok := optByID[optID]
		if !ok {
			continue
		}
		answered++
		var scoreMap map[string]float64
		if len(opt.ScoreMap) > 0 {
			_ = json.Unmarshal(opt.ScoreMap, &scoreMap)
		}
		for k, v := range scoreMap {
			scores[k] += v
		}
	}

	var recommended *models.TrackGroup
	bestTrack := ""
	bestScore := -1.0
	for track, score := range scores {
		if score > bestScore {
			bestScore = score
			bestTrack = track
		}
	}
	if bestTrack != "" {
		t := models.TrackGroup(bestTrack)
		recommended = &t
	}

	now := time.Now().UTC()
	answersJSON, _ := json.Marshal(req.Answers)
	resultPayload := map[string]any{
		"scores":         scores,
		"answered_count": answered,
		"question_count": len(questions),
	}
	resultJSON, _ := json.Marshal(resultPayload)

	attempt := &models.QuizAttempt{
		QuizID:           quizID,
		UserID:           userID,
		Answers:          datatypes.JSON(answersJSON),
		Result:           datatypes.JSON(resultJSON),
		RecommendedTrack: recommended,
		CompletedAt:      &now,
	}
	if err := s.quizzes.CreateAttempt(attempt); err != nil {
		return nil, err
	}
	return mapQuizAttempt(attempt), nil
}

func (s *quizService) ListAttempts(quizID uuid.UUID) ([]dto.QuizAttemptResponse, error) {
	if _, err := s.quizzes.FindQuizByID(quizID); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrQuizNotFound
		}
		return nil, err
	}
	items, err := s.quizzes.ListAttemptsByQuizID(quizID)
	if err != nil {
		return nil, err
	}
	out := make([]dto.QuizAttemptResponse, 0, len(items))
	for i := range items {
		out = append(out, *mapQuizAttempt(&items[i]))
	}
	return out, nil
}

func mapQuizAttempt(a *models.QuizAttempt) *dto.QuizAttemptResponse {
	var userID *string
	if a.UserID != nil {
		s := a.UserID.String()
		userID = &s
	}
	var track *string
	if a.RecommendedTrack != nil {
		s := string(*a.RecommendedTrack)
		track = &s
	}
	return &dto.QuizAttemptResponse{
		ID:               a.ID.String(),
		QuizID:           a.QuizID.String(),
		UserID:           userID,
		Answers:          json.RawMessage(a.Answers),
		Result:           json.RawMessage(a.Result),
		RecommendedTrack: track,
		CompletedAt:      a.CompletedAt,
	}
}
