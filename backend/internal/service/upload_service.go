package service

import (
	"context"
	"errors"
	"io"
	"strings"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/s3x"
)

var (
	ErrUploadNotConfigured   = errors.New("s3 upload is not configured")
	ErrInvalidUploadKind     = errors.New("invalid upload kind")
	ErrInvalidUploadMIMEType = errors.New("content type not allowed for this kind")
)

type UploadService interface {
	Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error)
	Put(ctx context.Context, kind, filename, contentType string, body io.Reader) (fileURL string, err error)
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

func KindFromContentType(contentType string) string {
	ct := strings.ToLower(strings.TrimSpace(contentType))
	switch {
	case strings.HasPrefix(ct, "image/"):
		return "image"
	case strings.HasPrefix(ct, "video/"):
		return "video"
	case ct == "application/pdf":
		return "pdf"
	default:
		return "file"
	}
}

func (s *uploadService) validate(kind, contentType string) error {
	kind = strings.ToLower(strings.TrimSpace(kind))
	if kind == "" {
		kind = "file"
	}
	allowed, ok := allowedTypes[kind]
	if !ok {
		return ErrInvalidUploadKind
	}
	ct := strings.ToLower(strings.TrimSpace(contentType))
	if _, ok := allowed[ct]; !ok {
		return ErrInvalidUploadMIMEType
	}
	return nil
}

func (s *uploadService) Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error) {
	if !s.Configured() {
		return nil, ErrUploadNotConfigured
	}

	kind := strings.ToLower(strings.TrimSpace(req.Kind))
	if kind == "" {
		kind = "file"
	}
	if err := s.validate(kind, req.ContentType); err != nil {
		return nil, err
	}
	ct := strings.ToLower(strings.TrimSpace(req.ContentType))

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

func (s *uploadService) Put(ctx context.Context, kind, filename, contentType string, body io.Reader) (string, error) {
	if !s.Configured() {
		return "", ErrUploadNotConfigured
	}
	if kind == "" {
		kind = KindFromContentType(contentType)
	}
	if err := s.validate(kind, contentType); err != nil {
		return "", err
	}
	ct := strings.ToLower(strings.TrimSpace(contentType))
	result, err := s.s3.PutObject(ctx, kind, filename, ct, body)
	if err != nil {
		return "", err
	}
	return result.FileURL, nil
}
