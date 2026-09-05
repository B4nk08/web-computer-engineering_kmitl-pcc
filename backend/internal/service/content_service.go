package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"gorm.io/datatypes"
)

var (
	ErrInvalidContentType = errors.New("invalid content type")
	ErrContentNotFound    = errors.New("content not found")
)

// contentTypes ที่อนุญาต (ตรงกับ schema)
var allowedContentTypes = map[models.ContentType]struct{}{
	models.ContentPage:        {},
	models.ContentStaff:       {},
	models.ContentStudentWork: {},
	models.ContentVideo:       {},
	models.ContentCareerPath:  {},
	models.ContentAdmissions:  {},
	models.ContentCurriculum:  {},
}

type ContentService interface {
	Create(req dto.CreateContentRequest) (*dto.ContentResponse, error)
	GetByID(id uuid.UUID) (*dto.ContentResponse, error)
	List(filter dto.ContentFilter) ([]dto.ContentResponse, error)
	Update(id uuid.UUID, req dto.UpdateContentRequest) (*dto.ContentResponse, error)
	Delete(id uuid.UUID) error
}

type contentService struct {
	contents repository.ContentRepository
}

func NewContentService(contents repository.ContentRepository) ContentService {
	return &contentService{contents: contents}
}

func (s *contentService) Create(req dto.CreateContentRequest) (*dto.ContentResponse, error) {
	contentType, err := parseContentType(req.Type)
	if err != nil {
		return nil, err
	}

	published := true
	if req.IsPublished != nil {
		published = *req.IsPublished
	}

	content := &models.Content{
		Type:        contentType,
		Slug:        req.Slug,
		Title:       req.Title,
		Body:        req.Body,
		ImageURL:    req.ImageURL,
		Extra:       datatypes.JSON(req.Extra),
		SortOrder:   req.SortOrder,
		IsPublished: published,
	}
	if published {
		now := time.Now().UTC()
		content.PublishedAt = &now
	}

	if err := s.contents.Create(content); err != nil {
		return nil, err
	}

	res := dto.NewContentResponse(content)
	return &res, nil
}

func (s *contentService) GetByID(id uuid.UUID) (*dto.ContentResponse, error) {
	content, err := s.contents.FindByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrContentNotFound
		}
		return nil, err
	}
	res := dto.NewContentResponse(content)
	return &res, nil
}

func (s *contentService) List(filter dto.ContentFilter) ([]dto.ContentResponse, error) {
	repoFilter := repository.ContentListFilter{}

	if filter.Type != "" {
		t, err := parseContentType(filter.Type)
		if err != nil {
			return nil, err
		}
		repoFilter.Type = &t
	}
	if filter.Slug != "" {
		slug := filter.Slug
		repoFilter.Slug = &slug
	}
	if filter.PublishedOnly {
		published := true
		repoFilter.IsPublished = &published
	} else if filter.IsPublished != nil {
		repoFilter.IsPublished = filter.IsPublished
	}

	items, err := s.contents.List(repoFilter)
	if err != nil {
		return nil, err
	}
	return dto.NewContentListResponse(items), nil
}

func (s *contentService) Update(id uuid.UUID, req dto.UpdateContentRequest) (*dto.ContentResponse, error) {
	content, err := s.contents.FindByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrContentNotFound
		}
		return nil, err
	}

	if req.Slug != nil {
		content.Slug = req.Slug
	}
	if req.Title != nil {
		content.Title = *req.Title
	}
	if req.Body != nil {
		content.Body = *req.Body
	}
	if req.ImageURL != nil {
		content.ImageURL = *req.ImageURL
	}
	if req.Extra != nil {
		content.Extra = datatypes.JSON(req.Extra)
	}
	if req.SortOrder != nil {
		content.SortOrder = *req.SortOrder
	}
	if req.IsPublished != nil {
		wasPublished := content.IsPublished
		content.IsPublished = *req.IsPublished
		// เผยแพร่ครั้งแรก → ตั้ง published_at
		if *req.IsPublished && !wasPublished {
			now := time.Now().UTC()
			content.PublishedAt = &now
		}
	}

	if err := s.contents.Update(content); err != nil {
		return nil, err
	}
	res := dto.NewContentResponse(content)
	return &res, nil
}

func (s *contentService) Delete(id uuid.UUID) error {
	if err := s.contents.Delete(id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrContentNotFound
		}
		return err
	}
	return nil
}

func parseContentType(raw string) (models.ContentType, error) {
	t := models.ContentType(raw)
	if _, ok := allowedContentTypes[t]; !ok {
		return "", ErrInvalidContentType
	}
	return t, nil
}
