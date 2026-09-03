package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/s3x"
)

var (
	ErrUploadNotConfigured    = errors.New("s3 upload is not configured")
	ErrInvalidUploadKind      = errors.New("invalid upload kind")
	ErrInvalidUploadMIMEType  = errors.New("content type not allowed for this kind")
)

type UploadService interface {
	Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error)
	Configured() bool
}

type uploadService struct {
	s3 *s3x.Client
}

func NewUploadService(client *s3x.Client) UploadService {
	return &uploadService{s3: client}
}

func (s *uploadService) Configured() bool {
	return s != nil && s.s3 != nil
}

var allowedTypes = map[string]map[string]struct{}{
	"image": {
		"image/jpeg": {},
		"image/png":  {},
		"image/webp": {},
		"image/gif":  {},
	},
	"video": {
		"video/mp4":       {},
		"video/webm":      {},
		"video/quicktime": {},
	},
	"pdf": {
		"application/pdf": {},
	},
	"file": {
		"image/jpeg":      {},
		"image/png":       {},
		"image/webp":      {},
		"image/gif":       {},
		"video/mp4":       {},
		"video/webm":      {},
		"video/quicktime": {},
		"application/pdf": {},
	},
}

func (s *uploadService) Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error) {
	if !s.Configured() {
		return nil, ErrUploadNotConfigured
	}

	kind := strings.ToLower(strings.TrimSpace(req.Kind))
	if kind == "" {
		kind = "file"
	}
	allowed, ok := allowedTypes[kind]
	if !ok {
		return nil, ErrInvalidUploadKind
	}
	ct := strings.ToLower(strings.TrimSpace(req.ContentType))
	if _, ok := allowed[ct]; !ok {
		return nil, ErrInvalidUploadMIMEType
	}

	expires := 15 * time.Minute
	result, err := s.s3.PresignPut(ctx, kind, req.Filename, ct, expires)
	if err != nil {
		return nil, err
	}
	return &dto.PresignUploadResponse{
		Key:         result.Key,
		UploadURL:   result.UploadURL,
		FileURL:     result.FileURL,
		ContentType: ct,
		ExpiresIn:   int(expires.Seconds()),
	}, nil
}
