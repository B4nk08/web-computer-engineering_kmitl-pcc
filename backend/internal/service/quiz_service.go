package service

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"math"
	"math/big"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"gorm.io/datatypes"
)

var (
	ErrInvalidQuizKind      = errors.New("invalid quiz kind")
	ErrQuizNotFound         = errors.New("quiz not found")
	ErrQuizQuestionNotFound = errors.New("quiz question not found")
	ErrQuizInactive         = errors.New("quiz is inactive")
	ErrQuizLoginRequired    = errors.New("login required for this quiz")
	ErrQuizIncomplete       = errors.New("please answer every question")
)

type QuizService interface {
	CreateQuiz(req dto.CreateQuizRequest) (*dto.QuizResponse, error)
	ListQuizzes(filter dto.QuizFilter) ([]dto.QuizResponse, error)
	ListCareerClusters() ([]dto.CareerClusterResponse, error)
	GetQuizAdmin(id uuid.UUID) (*dto.QuizDetailAdminResponse, error)
	GetQuizPlay(id uuid.UUID, userID *uuid.UUID) (*dto.QuizPlayResponse, error)
	UpdateQuiz(id uuid.UUID, req dto.UpdateQuizRequest) (*dto.QuizResponse, error)
	DeleteQuiz(id uuid.UUID) error

	AddQuestion(quizID uuid.UUID, req dto.CreateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error)
	UpdateQuestion(id uuid.UUID, req dto.UpdateQuizQuestionRequest) (*dto.QuizQuestionAdmin, error)
	DeleteQuestion(id uuid.UUID) error

	SubmitAttempt(quizID uuid.UUID, userID *uuid.UUID, req dto.SubmitQuizAttemptRequest) (*dto.QuizAttemptResponse, error)
	ListAttempts(quizID uuid.UUID) ([]dto.QuizAttemptResponse, error)
}

type quizService struct {
	quizzes  repository.QuizRepository
	clusters repository.CareerClusterRepository
	contents repository.ContentRepository
}

func NewQuizService(
	quizzes repository.QuizRepository,
	clusters repository.CareerClusterRepository,
	contents repository.ContentRepository,
) QuizService {
	return &quizService{quizzes: quizzes, clusters: clusters, contents: contents}
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
	if req.QuestionCount != nil && *req.QuestionCount > 0 {
		quiz.QuestionCount = *req.QuestionCount
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

func (s *quizService) ListCareerClusters() ([]dto.CareerClusterResponse, error) {
	items, err := s.clusters.ListActive()
	if err != nil {
		return nil, err
	}
	out := make([]dto.CareerClusterResponse, 0, len(items))
	for _, item := range items {
		out = append(out, dto.CareerClusterResponse{
			Code:        item.Code,
			Name:        item.Name,
			NameEn:      item.NameEn,
			Description: item.Description,
			ImageURL:    item.ImageURL,
			SortOrder:   item.SortOrder,
		})
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

func (s *quizService) GetQuizPlay(id uuid.UUID, userID *uuid.UUID) (*dto.QuizPlayResponse, error) {
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
	if quiz.Kind == models.QuizInternal && userID == nil {
		return nil, ErrQuizLoginRequired
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
	shuffleSlice(publicQs)
	n := playSize(quiz.QuestionCount, len(publicQs))
	publicQs = publicQs[:n]
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
	if req.QuestionCount != nil {
		if *req.QuestionCount < 0 {
			quiz.QuestionCount = 0
		} else {
			quiz.QuestionCount = *req.QuestionCount
		}
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
	if len(req.Options) >= 2 {
		opts := make([]models.QuizOption, 0, len(req.Options))
		for _, o := range req.Options {
			opts = append(opts, models.QuizOption{
				QuestionID: q.ID,
				Label:      o.Label,
				ScoreMap:   datatypes.JSON(o.ScoreMap),
				SortOrder:  o.SortOrder,
			})
		}
		if err := s.quizzes.ReplaceOptions(q.ID, opts); err != nil {
			return nil, err
		}
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
	if quiz.Kind == models.QuizInternal && userID == nil {
		return nil, ErrQuizLoginRequired
	}

	questions, err := s.quizzes.ListQuestionsByQuizID(quizID)
	if err != nil {
		return nil, err
	}
	qIDs := make([]uuid.UUID, 0, len(questions))
	questionSet := map[string]struct{}{}
	for _, q := range questions {
		qIDs = append(qIDs, q.ID)
		questionSet[q.ID.String()] = struct{}{}
	}
	options, err := s.quizzes.ListOptionsByQuestionIDs(qIDs)
	if err != nil {
		return nil, err
	}
	optByID := map[string]models.QuizOption{}
	for _, o := range options {
		optByID[o.ID.String()] = o
	}

	answered := map[string]struct{}{}
	scores := map[string]float64{}
	for qID, optID := range req.Answers {
		if _, ok := questionSet[qID]; !ok {
			continue
		}
		opt, ok := optByID[optID]
		if !ok || opt.QuestionID.String() != qID {
			continue
		}
		answered[qID] = struct{}{}
		var scoreMap map[string]float64
		if len(opt.ScoreMap) > 0 {
			_ = json.Unmarshal(opt.ScoreMap, &scoreMap)
		}
		for k, v := range scoreMap {
			scores[k] += v
		}
	}
	need := playSize(quiz.QuestionCount, len(questions))
	if need == 0 || len(answered) != need {
		return nil, ErrQuizIncomplete
	}

	played := make([]models.QuizQuestion, 0, len(answered))
	for _, q := range questions {
		if _, ok := answered[q.ID.String()]; ok {
			played = append(played, q)
		}
	}

	var recommended *models.TrackGroup
	var resultJSON []byte
	if quiz.Kind == models.QuizInternal {
		payload, rec, err := s.buildInternalResult(scores, len(played), len(answered))
		if err != nil {
			return nil, err
		}
		resultJSON, _ = json.Marshal(payload)
		recommended = rec
	} else {
		payload := buildExternalResult(played, options, req.Answers, optByID, len(answered))
		resultJSON, _ = json.Marshal(payload)
	}

	now := time.Now().UTC()
	answersJSON, _ := json.Marshal(req.Answers)
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

const internalCloseGap = 12

func playSize(configured, bank int) int {
	if bank <= 0 {
		return 0
	}
	if configured <= 0 || configured >= bank {
		return bank
	}
	return configured
}

func shuffleSlice[T any](items []T) {
	for i := len(items) - 1; i > 0; i-- {
		jBig, err := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		if err != nil {
			return
		}
		j := int(jBig.Int64())
		items[i], items[j] = items[j], items[i]
	}
}

func (s *quizService) buildInternalResult(scores map[string]float64, questionCount, answeredCount int) (*dto.InternalQuizResult, *models.TrackGroup, error) {
	clusters, err := s.clusters.ListActive()
	if err != nil {
		return nil, nil, err
	}
	views := make([]dto.ClusterScoreView, 0, len(clusters))
	for _, cluster := range clusters {
		score := scores[cluster.Code]
		percent := 0
		if questionCount > 0 {
			percent = int(math.Round((score / float64(questionCount)) * 100))
		}
		views = append(views, dto.ClusterScoreView{
			Code:        cluster.Code,
			Name:        cluster.Name,
			NameEn:      cluster.NameEn,
			Description: cluster.Description,
			Score:       score,
			Percent:     percent,
		})
	}
	sort.SliceStable(views, func(i, j int) bool {
		if views[i].Percent != views[j].Percent {
			return views[i].Percent > views[j].Percent
		}
		if views[i].Score != views[j].Score {
			return views[i].Score > views[j].Score
		}
		return views[i].Code < views[j].Code
	})

	isClose := false
	recommendedCode := ""
	if len(views) > 0 && views[0].Score > 0 {
		recommendedCode = views[0].Code
		if len(views) > 1 {
			gap := views[0].Percent - views[1].Percent
			isClose = gap < internalCloseGap
		}
		careers, err := s.careerBriefs(views[0].Code, 4)
		if err != nil {
			return nil, nil, err
		}
		views[0].Careers = careers
		if isClose && len(views) > 1 {
			runner, err := s.careerBriefs(views[1].Code, 2)
			if err != nil {
				return nil, nil, err
			}
			views[1].Careers = runner
		}
	}

	var rec *models.TrackGroup
	if recommendedCode != "" {
		t := models.TrackGroup(recommendedCode)
		rec = &t
	}
	return &dto.InternalQuizResult{
		Kind:            string(models.QuizInternal),
		QuestionCount:   questionCount,
		AnsweredCount:   answeredCount,
		IsClose:         isClose,
		RecommendedCode: recommendedCode,
		Clusters:        views,
	}, rec, nil
}

func (s *quizService) careerBriefs(clusterCode string, limit int) ([]dto.CareerBrief, error) {
	items, err := s.contents.ListPublishedCareersByCluster(clusterCode)
	if err != nil {
		return nil, err
	}
	if limit > 0 && len(items) > limit {
		items = items[:limit]
	}
	out := make([]dto.CareerBrief, 0, len(items))
	for _, item := range items {
		role := extraString(item.Extra, "role")
		if role == "" {
			role = extraString(item.Extra, "position")
		}
		out = append(out, dto.CareerBrief{
			ID:       item.ID.String(),
			Title:    item.Title,
			Role:     role,
			Detail:   item.Body,
			ImageURL: item.ImageURL,
		})
	}
	return out, nil
}

func parseOptionScoreMap(raw datatypes.JSON) map[string]float64 {
	if len(raw) == 0 {
		return nil
	}
	var scoreMap map[string]float64
	_ = json.Unmarshal(raw, &scoreMap)
	return scoreMap
}

func optionWeight(scoreMap map[string]float64) float64 {
	if len(scoreMap) == 0 {
		return 0
	}
	if v, ok := scoreMap["readiness"]; ok {
		return v
	}
	var sum float64
	for _, v := range scoreMap {
		sum += v
	}
	return sum
}

func externalBand(percent int) string {
	switch {
	case percent >= 80:
		return "high"
	case percent >= 60:
		return "fair"
	case percent >= 40:
		return "prepare"
	default:
		return "low"
	}
}

func buildExternalResult(
	questions []models.QuizQuestion,
	options []models.QuizOption,
	answers map[string]string,
	optByID map[string]models.QuizOption,
	answeredCount int,
) dto.ExternalQuizResult {
	optsByQ := map[string][]models.QuizOption{}
	for _, option := range options {
		qid := option.QuestionID.String()
		optsByQ[qid] = append(optsByQ[qid], option)
	}

	var score, maxScore float64
	for _, question := range questions {
		qid := question.ID.String()
		qMax := 0.0
		for _, option := range optsByQ[qid] {
			w := optionWeight(parseOptionScoreMap(option.ScoreMap))
			if w > qMax {
				qMax = w
			}
		}
		maxScore += qMax
		if optID, ok := answers[qid]; ok {
			if option, found := optByID[optID]; found {
				score += optionWeight(parseOptionScoreMap(option.ScoreMap))
			}
		}
	}

	percent := 0
	if maxScore > 0 {
		percent = int(math.Round((score / maxScore) * 100))
	}

	return dto.ExternalQuizResult{
		Kind:          string(models.QuizExternal),
		QuestionCount: len(questions),
		AnsweredCount: answeredCount,
		Score:         score,
		MaxScore:      maxScore,
		Percent:       percent,
		Band:          externalBand(percent),
	}
}

func extraString(raw datatypes.JSON, key string) string {
	if len(raw) == 0 {
		return ""
	}
	var extra map[string]any
	if err := json.Unmarshal(raw, &extra); err != nil {
		return ""
	}
	value, ok := extra[key]
	if !ok {
		return ""
	}
	s, _ := value.(string)
	return s
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
