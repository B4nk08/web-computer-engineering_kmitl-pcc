package service

import (
	"context"
	"errors"
	"io"
	"path"
	"strings"
	"time"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/s3x"
)

var (
	ErrUploadNotConfigured   = errors.New("s3 upload is not configured")
	ErrInvalidUploadKind     = errors.New("invalid upload kind")
	ErrInvalidUploadMIMEType = errors.New("content type not allowed for this kind")
	ErrUploadTooLarge        = errors.New("file too large")
	ErrInvalidUploadTarget   = errors.New("invalid upload key or file_url")
)

const maxUploadBytes = 500 << 20 // 500 MiB

type UploadService interface {
	Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error)
	Upload(ctx context.Context, kind, filename, contentType string, body io.Reader, size int64) (*dto.DirectUploadResponse, error)
	Delete(ctx context.Context, req dto.DeleteUploadRequest) (*dto.DeleteUploadResponse, error)
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
		"video/mp4":        {},
		"video/webm":       {},
		"video/quicktime":  {},
		"video/x-m4v":      {},
		"video/x-msvideo":  {},
		"video/avi":        {},
		"application/mp4":  {},
	},
	"pdf": {
		"application/pdf": {},
	},
	"file": {
		"image/jpeg":       {},
		"image/png":        {},
		"image/webp":       {},
		"image/gif":        {},
		"video/mp4":        {},
		"video/webm":       {},
		"video/quicktime":  {},
		"video/x-m4v":      {},
		"video/x-msvideo":  {},
		"video/avi":        {},
		"application/mp4":  {},
		"application/pdf":  {},
	},
}

func (s *uploadService) Presign(ctx context.Context, req dto.PresignUploadRequest) (*dto.PresignUploadResponse, error) {
	if !s.Configured() {
		return nil, ErrUploadNotConfigured
	}

	kind, ct, err := s.validateKindAndType(req.Kind, req.ContentType, req.Filename)
	if err != nil {
		return nil, err
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

func (s *uploadService) Upload(
	ctx context.Context,
	kind, filename, contentType string,
	body io.Reader,
	size int64,
) (*dto.DirectUploadResponse, error) {
	if !s.Configured() {
		return nil, ErrUploadNotConfigured
	}
	if size > maxUploadBytes {
		return nil, ErrUploadTooLarge
	}

	kind, ct, err := s.validateKindAndType(kind, contentType, filename)
	if err != nil {
		return nil, err
	}

	result, err := s.s3.Put(ctx, kind, filename, ct, body, size)
	if err != nil {
		return nil, err
	}
	return &dto.DirectUploadResponse{
		Key:         result.Key,
		FileURL:     result.FileURL,
		ContentType: ct,
	}, nil
}

func (s *uploadService) Delete(ctx context.Context, req dto.DeleteUploadRequest) (*dto.DeleteUploadResponse, error) {
	if !s.Configured() {
		return nil, ErrUploadNotConfigured
	}

	key := strings.TrimLeft(strings.TrimSpace(req.Key), "/")
	if key == "" && strings.TrimSpace(req.FileURL) != "" {
		parsed, err := s.s3.KeyFromURL(req.FileURL)
		if err != nil {
			return nil, ErrInvalidUploadTarget
		}
		key = parsed
	}
	if !isSafeUploadKey(key) {
		return nil, ErrInvalidUploadTarget
	}

	if err := s.s3.Delete(ctx, key); err != nil {
		return nil, err
	}
	return &dto.DeleteUploadResponse{Key: key, Deleted: true}, nil
}

func isSafeUploadKey(key string) bool {
	key = strings.TrimLeft(strings.TrimSpace(key), "/")
	if key == "" || strings.Contains(key, "..") {
		return false
	}
	return strings.HasPrefix(key, "uploads/")
}

func (s *uploadService) validateKindAndType(kind, contentType, filename string) (string, string, error) {
	kind = strings.ToLower(strings.TrimSpace(kind))
	if kind == "" {
		kind = "file"
	}
	allowed, ok := allowedTypes[kind]
	if !ok {
		return "", "", ErrInvalidUploadKind
	}

	ct := strings.ToLower(strings.TrimSpace(contentType))
	if ct == "" || ct == "application/octet-stream" {
		ct = guessContentType(filename)
	}
	if _, ok := allowed[ct]; !ok {
		return "", "", ErrInvalidUploadMIMEType
	}
	return kind, ct, nil
}

func guessContentType(filename string) string {
	ext := strings.ToLower(path.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".webp":
		return "image/webp"
	case ".gif":
		return "image/gif"
	case ".mp4":
		return "video/mp4"
	case ".webm":
		return "video/webm"
	case ".mov":
		return "video/quicktime"
	case ".m4v":
		return "video/x-m4v"
	case ".avi":
		return "video/x-msvideo"
	case ".pdf":
		return "application/pdf"
	default:
		return "application/octet-stream"
	}
}
