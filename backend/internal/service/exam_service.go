package service

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"math/big"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/hashx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"gorm.io/datatypes"
)

var (
	ErrInvalidTrackGroup      = errors.New("invalid subject/track")
	ErrInvalidExamMode        = errors.New("invalid exam mode")
	ErrExamQuestionNotFound   = errors.New("exam question not found")
	ErrExamSettingNotFound    = errors.New("exam setting not found")
	ErrExamSettingDisabled    = errors.New("exam setting is disabled")
	ErrExamNotEnoughQuestions = errors.New("not enough active questions")
	ErrExamCredentialInvalid  = errors.New("invalid exam credential")
	ErrExamCredentialUsed     = errors.New("exam credential already used")
	ErrExamCredentialExpired  = errors.New("exam credential expired")
	ErrExamAttemptNotFound    = errors.New("exam attempt not found")
	ErrExamAttemptClosed      = errors.New("exam attempt already submitted or expired")
	ErrExamOutsideWindow      = errors.New("exam is outside allowed time window")
)

type ExamService interface {
	CreateQuestion(req dto.CreateExamQuestionRequest, createdBy *uuid.UUID) (*dto.ExamQuestionAdminResponse, error)
	ListQuestions(filter dto.ExamQuestionFilter) ([]dto.ExamQuestionAdminResponse, error)
	UpdateQuestion(id uuid.UUID, req dto.UpdateExamQuestionRequest) (*dto.ExamQuestionAdminResponse, error)
	DeleteQuestion(id uuid.UUID) error

	UpsertSetting(req dto.UpsertExamSettingRequest, updatedBy *uuid.UUID) (*dto.ExamSettingResponse, error)
	ListSettings() ([]dto.ExamSettingResponse, error)
	GetSetting(subject, mode string) (*dto.ExamSettingResponse, error)

	CreateCredential(req dto.CreateExamCredentialRequest) (*dto.ExamCredentialResponse, error)
	ListCredentials(subject string) ([]dto.ExamCredentialResponse, error)

	StartAttempt(req dto.StartExamRequest, userID *uuid.UUID) (*dto.ExamAttemptStartResponse, error)
	SubmitAttempt(attemptID uuid.UUID, req dto.SubmitExamAttemptRequest) (*dto.ExamAttemptResultResponse, error)
	ListAttempts(subject, mode string) ([]dto.ExamAttemptAdminResponse, error)
}

type examService struct {
	exams repository.ExamRepository
}

func NewExamService(exams repository.ExamRepository) ExamService {
	return &examService{exams: exams}
}

func parseTrackGroup(v string) (models.TrackGroup, error) {
	switch models.TrackGroup(v) {
	case models.TrackIoT, models.TrackSoftware, models.TrackNetwork, models.TrackProgramming:
		return models.TrackGroup(v), nil
	default:
		return "", ErrInvalidTrackGroup
	}
}

func parseExamMode(v string) (models.ExamMode, error) {
	switch models.ExamMode(v) {
	case models.ExamMock, models.ExamReal:
		return models.ExamMode(v), nil
	default:
		return "", ErrInvalidExamMode
	}
}

func marshalChoices(choices []dto.ExamChoice) (datatypes.JSON, error) {
	b, err := json.Marshal(choices)
	if err != nil {
		return nil, err
	}
	return datatypes.JSON(b), nil
}

func unmarshalChoices(raw datatypes.JSON) []dto.ExamChoice {
	var choices []dto.ExamChoice
	if len(raw) == 0 {
		return choices
	}
	_ = json.Unmarshal(raw, &choices)
	return choices
}

func toAdminQuestion(q *models.ExamQuestion) dto.ExamQuestionAdminResponse {
	return dto.ExamQuestionAdminResponse{
		ID:        q.ID.String(),
		Subject:   string(q.Subject),
		Mode:      string(q.Mode),
		Prompt:    q.Prompt,
		ImageURL:  q.ImageURL,
		Choices:   unmarshalChoices(q.Choices),
		IsActive:  q.IsActive,
		CreatedAt: q.CreatedAt,
		UpdatedAt: q.UpdatedAt,
	}
}

func (s *examService) CreateQuestion(req dto.CreateExamQuestionRequest, createdBy *uuid.UUID) (*dto.ExamQuestionAdminResponse, error) {
	subject, err := parseTrackGroup(req.Subject)
	if err != nil {
		return nil, err
	}
	mode, err := parseExamMode(req.Mode)
	if err != nil {
		return nil, err
	}
	choicesJSON, err := marshalChoices(req.Choices)
	if err != nil {
		return nil, err
	}
	active := true
	if req.IsActive != nil {
		active = *req.IsActive
	}
	q := &models.ExamQuestion{
		Subject:   subject,
		Mode:      mode,
		Prompt:    req.Prompt,
		ImageURL:  req.ImageURL,
		Choices:   choicesJSON,
		IsActive:  active,
		CreatedBy: createdBy,
	}
	if err := s.exams.CreateQuestion(q); err != nil {
		return nil, err
	}
	res := toAdminQuestion(q)
	return &res, nil
}

func (s *examService) ListQuestions(filter dto.ExamQuestionFilter) ([]dto.ExamQuestionAdminResponse, error) {
	repoFilter := repository.ExamQuestionListFilter{IsActive: filter.IsActive}
	if filter.Subject != "" {
		subject, err := parseTrackGroup(filter.Subject)
		if err != nil {
			return nil, err
		}
		repoFilter.Subject = &subject
	}
	if filter.Mode != "" {
		mode, err := parseExamMode(filter.Mode)
		if err != nil {
			return nil, err
		}
		repoFilter.Mode = &mode
	}
	items, err := s.exams.ListQuestions(repoFilter)
	if err != nil {
		return nil, err
	}
	out := make([]dto.ExamQuestionAdminResponse, 0, len(items))
	for i := range items {
		out = append(out, toAdminQuestion(&items[i]))
	}
	return out, nil
}

func (s *examService) UpdateQuestion(id uuid.UUID, req dto.UpdateExamQuestionRequest) (*dto.ExamQuestionAdminResponse, error) {
	q, err := s.exams.FindQuestionByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrExamQuestionNotFound
		}
		return nil, err
	}
	if req.Prompt != nil {
		q.Prompt = *req.Prompt
	}
	if req.ImageURL != nil {
		q.ImageURL = *req.ImageURL
	}
	if req.Choices != nil {
		choicesJSON, err := marshalChoices(req.Choices)
		if err != nil {
			return nil, err
		}
		q.Choices = choicesJSON
	}
	if req.IsActive != nil {
		q.IsActive = *req.IsActive
	}
	if err := s.exams.UpdateQuestion(q); err != nil {
		return nil, err
	}
	res := toAdminQuestion(q)
	return &res, nil
}

func (s *examService) DeleteQuestion(id uuid.UUID) error {
	if err := s.exams.DeleteQuestion(id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrExamQuestionNotFound
		}
		return err
	}
	return nil
}

func (s *examService) UpsertSetting(req dto.UpsertExamSettingRequest, updatedBy *uuid.UUID) (*dto.ExamSettingResponse, error) {
	subject, err := parseTrackGroup(req.Subject)
	if err != nil {
		return nil, err
	}
	mode, err := parseExamMode(req.Mode)
	if err != nil {
		return nil, err
	}
	enabled := true
	if req.IsEnabled != nil {
		enabled = *req.IsEnabled
	}

	existing, err := s.exams.FindSetting(subject, mode)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}

	if errors.Is(err, repository.ErrNotFound) || existing == nil {
		setting := &models.ExamSetting{
			Subject:          subject,
			Mode:             mode,
			QuestionCount:    req.QuestionCount,
			TimeLimitMinutes: req.TimeLimitMinutes,
			IsEnabled:        enabled,
			StartsAt:         req.StartsAt,
			EndsAt:           req.EndsAt,
			UpdatedBy:        updatedBy,
		}
		if err := s.exams.CreateSetting(setting); err != nil {
			return nil, err
		}
		res := dto.NewExamSettingResponse(setting)
		return &res, nil
	}

	existing.QuestionCount = req.QuestionCount
	existing.TimeLimitMinutes = req.TimeLimitMinutes
	existing.IsEnabled = enabled
	existing.StartsAt = req.StartsAt
	existing.EndsAt = req.EndsAt
	existing.UpdatedBy = updatedBy
	if err := s.exams.UpdateSetting(existing); err != nil {
		return nil, err
	}
	res := dto.NewExamSettingResponse(existing)
	return &res, nil
}

func (s *examService) ListSettings() ([]dto.ExamSettingResponse, error) {
	items, err := s.exams.ListSettings()
	if err != nil {
		return nil, err
	}
	out := make([]dto.ExamSettingResponse, 0, len(items))
	for i := range items {
		out = append(out, dto.NewExamSettingResponse(&items[i]))
	}
	return out, nil
}

func (s *examService) GetSetting(subject, mode string) (*dto.ExamSettingResponse, error) {
	subj, err := parseTrackGroup(subject)
	if err != nil {
		return nil, err
	}
	m, err := parseExamMode(mode)
	if err != nil {
		return nil, err
	}
	setting, err := s.exams.FindSetting(subj, m)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrExamSettingNotFound
		}
		return nil, err
	}
	res := dto.NewExamSettingResponse(setting)
	return &res, nil
}

func randomPassword(n int) (string, error) {
	const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	out := make([]byte, n)
	for i := 0; i < n; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(chars))))
		if err != nil {
			return "", err
		}
		out[i] = chars[num.Int64()]
	}
	return string(out), nil
}

func (s *examService) CreateCredential(req dto.CreateExamCredentialRequest) (*dto.ExamCredentialResponse, error) {
	subject, err := parseTrackGroup(req.Subject)
	if err != nil {
		return nil, err
	}
	plain, err := randomPassword(10)
	if err != nil {
		return nil, err
	}
	hashed, err := hashx.Hash(plain)
	if err != nil {
		return nil, err
	}
	usernameBytes := make([]byte, 4)
	if _, err := rand.Read(usernameBytes); err != nil {
		return nil, err
	}
	username := "exam_" + hex.EncodeToString(usernameBytes)

	var userID *uuid.UUID
	if req.UserID != nil && *req.UserID != "" {
		id, err := uuid.Parse(*req.UserID)
		if err != nil {
			return nil, err
		}
		userID = &id
	}

	cred := &models.ExamCredential{
		Subject:   subject,
		UserID:    userID,
		Username:  username,
		Password:  hashed,
		IsUsed:    false,
		ExpiresAt: req.ExpiresAt,
	}
	if err := s.exams.CreateCredential(cred); err != nil {
		return nil, err
	}

	var userIDStr *string
	if userID != nil {
		s := userID.String()
		userIDStr = &s
	}
	return &dto.ExamCredentialResponse{
		ID:        cred.ID.String(),
		Subject:   string(cred.Subject),
		UserID:    userIDStr,
		Username:  cred.Username,
		Password:  plain, // แสดง plain เฉพาะตอนสร้าง
		IsUsed:    cred.IsUsed,
		ExpiresAt: cred.ExpiresAt,
		CreatedAt: cred.CreatedAt,
	}, nil
}

func (s *examService) ListCredentials(subject string) ([]dto.ExamCredentialResponse, error) {
	var subjPtr *models.TrackGroup
	if subject != "" {
		subj, err := parseTrackGroup(subject)
		if err != nil {
			return nil, err
		}
		subjPtr = &subj
	}
	items, err := s.exams.ListCredentials(subjPtr)
	if err != nil {
		return nil, err
	}
	out := make([]dto.ExamCredentialResponse, 0, len(items))
	for _, c := range items {
		var userIDStr *string
		if c.UserID != nil {
			s := c.UserID.String()
			userIDStr = &s
		}
		out = append(out, dto.ExamCredentialResponse{
			ID:        c.ID.String(),
			Subject:   string(c.Subject),
			UserID:    userIDStr,
			Username:  c.Username,
			Password:  "", // ไม่ส่ง hash กลับ
			IsUsed:    c.IsUsed,
			ExpiresAt: c.ExpiresAt,
			CreatedAt: c.CreatedAt,
		})
	}
	return out, nil
}

func shuffleQuestions(items []models.ExamQuestion) {
	for i := len(items) - 1; i > 0; i-- {
		jBig, err := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		if err != nil {
			return
		}
		j := int(jBig.Int64())
		items[i], items[j] = items[j], items[i]
	}
}

func (s *examService) StartAttempt(req dto.StartExamRequest, userID *uuid.UUID) (*dto.ExamAttemptStartResponse, error) {
	subject, err := parseTrackGroup(req.Subject)
	if err != nil {
		return nil, err
	}
	mode, err := parseExamMode(req.Mode)
	if err != nil {
		return nil, err
	}

	setting, err := s.exams.FindSetting(subject, mode)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrExamSettingNotFound
		}
		return nil, err
	}
	if !setting.IsEnabled {
		return nil, ErrExamSettingDisabled
	}
	now := time.Now().UTC()
	if setting.StartsAt != nil && now.Before(*setting.StartsAt) {
		return nil, ErrExamOutsideWindow
	}
	if setting.EndsAt != nil && now.After(*setting.EndsAt) {
		return nil, ErrExamOutsideWindow
	}

	var credentialID *uuid.UUID
	if mode == models.ExamReal {
		cred, err := s.exams.FindCredentialByUsername(req.Username)
		if err != nil {
			return nil, ErrExamCredentialInvalid
		}
		if cred.Subject != subject {
			return nil, ErrExamCredentialInvalid
		}
		if cred.IsUsed {
			return nil, ErrExamCredentialUsed
		}
		if cred.ExpiresAt != nil && now.After(*cred.ExpiresAt) {
			return nil, ErrExamCredentialExpired
		}
		if !hashx.Compare(cred.Password, req.Password) {
			return nil, ErrExamCredentialInvalid
		}
		cred.IsUsed = true
		if err := s.exams.UpdateCredential(cred); err != nil {
			return nil, err
		}
		credentialID = &cred.ID
		if userID == nil && cred.UserID != nil {
			userID = cred.UserID
		}
	}

	bank, err := s.exams.ListActiveQuestions(subject, mode)
	if err != nil {
		return nil, err
	}
	if len(bank) < setting.QuestionCount {
		return nil, ErrExamNotEnoughQuestions
	}
	shuffleQuestions(bank)
	selected := bank[:setting.QuestionCount]

	orderIDs := make([]string, 0, len(selected))
	playItems := make([]dto.ExamQuestionPlayItem, 0, len(selected))
	choiceOrderMap := map[string][]string{}

	for _, q := range selected {
		orderIDs = append(orderIDs, q.ID.String())
		choices := unmarshalChoices(q.Choices)
		// shuffle choice keys order for display
		keys := make([]string, 0, len(choices))
		publicChoices := make([]dto.ExamChoicePublic, 0, len(choices))
		for _, c := range choices {
			keys = append(keys, c.Key)
			publicChoices = append(publicChoices, dto.ExamChoicePublic{Key: c.Key, Text: c.Text})
		}
		for i := len(publicChoices) - 1; i > 0; i-- {
			jBig, _ := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
			j := int(jBig.Int64())
			publicChoices[i], publicChoices[j] = publicChoices[j], publicChoices[i]
			keys[i], keys[j] = keys[j], keys[i]
		}
		choiceOrderMap[q.ID.String()] = keys
		playItems = append(playItems, dto.ExamQuestionPlayItem{
			ID:       q.ID.String(),
			Prompt:   q.Prompt,
			ImageURL: q.ImageURL,
			Choices:  publicChoices,
		})
	}

	orderJSON, _ := json.Marshal(orderIDs)
	choiceJSON, _ := json.Marshal(choiceOrderMap)
	attempt := &models.ExamAttempt{
		UserID:         userID,
		Subject:        subject,
		Mode:           mode,
		CredentialID:   credentialID,
		QuestionOrder:  datatypes.JSON(orderJSON),
		ChoiceOrderMap: datatypes.JSON(choiceJSON),
		Status:         models.AttemptInProgress,
		StartedAt:      &now,
	}
	if err := s.exams.CreateAttempt(attempt); err != nil {
		return nil, err
	}

	return &dto.ExamAttemptStartResponse{
		AttemptID:        attempt.ID.String(),
		Subject:          string(subject),
		Mode:             string(mode),
		TimeLimitMinutes: setting.TimeLimitMinutes,
		StartedAt:        attempt.StartedAt,
		Questions:        playItems,
	}, nil
}

func (s *examService) SubmitAttempt(attemptID uuid.UUID, req dto.SubmitExamAttemptRequest) (*dto.ExamAttemptResultResponse, error) {
	attempt, err := s.exams.FindAttemptByID(attemptID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrExamAttemptNotFound
		}
		return nil, err
	}
	if attempt.Status != models.AttemptInProgress {
		return nil, ErrExamAttemptClosed
	}

	var orderIDs []string
	_ = json.Unmarshal(attempt.QuestionOrder, &orderIDs)

	var score float64
	var maxScore float64
	for _, qid := range orderIDs {
		id, err := uuid.Parse(qid)
		if err != nil {
			continue
		}
		q, err := s.exams.FindQuestionByID(id)
		if err != nil {
			continue
		}
		maxScore++
		choices := unmarshalChoices(q.Choices)
		correctKey := ""
		for _, c := range choices {
			if c.IsCorrect {
				correctKey = c.Key
				break
			}
		}
		if ans, ok := req.Answers[qid]; ok && ans == correctKey {
			score++
		}
	}

	now := time.Now().UTC()
	answersJSON, _ := json.Marshal(req.Answers)
	attempt.Answers = datatypes.JSON(answersJSON)
	attempt.Score = &score
	attempt.MaxScore = &maxScore
	attempt.Status = models.AttemptSubmitted
	attempt.SubmittedAt = &now
	if err := s.exams.UpdateAttempt(attempt); err != nil {
		return nil, err
	}

	return &dto.ExamAttemptResultResponse{
		AttemptID:   attempt.ID.String(),
		Subject:     string(attempt.Subject),
		Mode:        string(attempt.Mode),
		Score:       attempt.Score,
		MaxScore:    attempt.MaxScore,
		Status:      string(attempt.Status),
		SubmittedAt: attempt.SubmittedAt,
	}, nil
}

func (s *examService) ListAttempts(subject, mode string) ([]dto.ExamAttemptAdminResponse, error) {
	var subjPtr *models.TrackGroup
	var modePtr *models.ExamMode
	if subject != "" {
		subj, err := parseTrackGroup(subject)
		if err != nil {
			return nil, err
		}
		subjPtr = &subj
	}
	if mode != "" {
		m, err := parseExamMode(mode)
		if err != nil {
			return nil, err
		}
		modePtr = &m
	}
	items, err := s.exams.ListAttempts(subjPtr, modePtr)
	if err != nil {
		return nil, err
	}
	out := make([]dto.ExamAttemptAdminResponse, 0, len(items))
	for _, a := range items {
		var userID *string
		if a.UserID != nil {
			s := a.UserID.String()
			userID = &s
		}
		out = append(out, dto.ExamAttemptAdminResponse{
			ID:          a.ID.String(),
			UserID:      userID,
			Subject:     string(a.Subject),
			Mode:        string(a.Mode),
			Score:       a.Score,
			MaxScore:    a.MaxScore,
			Status:      string(a.Status),
			Answers:     json.RawMessage(a.Answers),
			StartedAt:   a.StartedAt,
			SubmittedAt: a.SubmittedAt,
		})
	}
	return out, nil
}
