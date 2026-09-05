package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

var (
	ErrInvalidNewsAudience = errors.New("invalid news audience")
	ErrNewsNotFound        = errors.New("news not found")
)

var allowedNewsAudiences = map[models.NewsAudience]struct{}{
	models.NewsExternal: {},
	models.NewsInternal: {},
}

type NewsService interface {
	Create(req dto.CreateNewsRequest) (*dto.NewsResponse, error)
	GetByID(id uuid.UUID) (*dto.NewsResponse, error)
	List(filter dto.NewsFilter) ([]dto.NewsResponse, error)
	Update(id uuid.UUID, req dto.UpdateNewsRequest) (*dto.NewsResponse, error)
	Delete(id uuid.UUID) error
}

type newsService struct {
	news repository.NewsRepository
}

func NewNewsService(news repository.NewsRepository) NewsService {
	return &newsService{news: news}
}

func (s *newsService) Create(req dto.CreateNewsRequest) (*dto.NewsResponse, error) {
	audience, err := parseNewsAudience(req.Audience)
	if err != nil {
		return nil, err
	}

	published := true
	if req.IsPublished != nil {
		published = *req.IsPublished
	}

	item := &models.News{
		Audience:    audience,
		Title:       req.Title,
		Body:        req.Body,
		ImageURL:    req.ImageURL,
		IsPublished: published,
	}
	if published {
		now := time.Now().UTC()
		item.PublishedAt = &now
	}

	if err := s.news.Create(item); err != nil {
		return nil, err
	}
	res := dto.NewNewsResponse(item)
	return &res, nil
}

func (s *newsService) GetByID(id uuid.UUID) (*dto.NewsResponse, error) {
	item, err := s.news.FindByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrNewsNotFound
		}
		return nil, err
	}
	res := dto.NewNewsResponse(item)
	return &res, nil
}

func (s *newsService) List(filter dto.NewsFilter) ([]dto.NewsResponse, error) {
	repoFilter := repository.NewsListFilter{}

	if filter.Audience != "" {
		audience, err := parseNewsAudience(filter.Audience)
		if err != nil {
			return nil, err
		}
		repoFilter.Audience = &audience
	}
	if filter.PublishedOnly {
		published := true
		repoFilter.IsPublished = &published
	} else if filter.IsPublished != nil {
		repoFilter.IsPublished = filter.IsPublished
	}

	items, err := s.news.List(repoFilter)
	if err != nil {
		return nil, err
	}
	return dto.NewNewsListResponse(items), nil
}

func (s *newsService) Update(id uuid.UUID, req dto.UpdateNewsRequest) (*dto.NewsResponse, error) {
	item, err := s.news.FindByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrNewsNotFound
		}
		return nil, err
	}

	if req.Audience != nil {
		audience, err := parseNewsAudience(*req.Audience)
		if err != nil {
			return nil, err
		}
		item.Audience = audience
	}
	if req.Title != nil {
		item.Title = *req.Title
	}
	if req.Body != nil {
		item.Body = *req.Body
	}
	if req.ImageURL != nil {
		item.ImageURL = *req.ImageURL
	}
	if req.IsPublished != nil {
		wasPublished := item.IsPublished
		item.IsPublished = *req.IsPublished
		if *req.IsPublished && !wasPublished {
			now := time.Now().UTC()
			item.PublishedAt = &now
		}
	}

	if err := s.news.Update(item); err != nil {
		return nil, err
	}
	res := dto.NewNewsResponse(item)
	return &res, nil
}

func (s *newsService) Delete(id uuid.UUID) error {
	if err := s.news.Delete(id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return ErrNewsNotFound
		}
		return err
	}
	return nil
}

func parseNewsAudience(raw string) (models.NewsAudience, error) {
	a := models.NewsAudience(raw)
	if _, ok := allowedNewsAudiences[a]; !ok {
		return "", ErrInvalidNewsAudience
	}
	return a, nil
}
