package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

type UploadHandler struct {
	svc service.UploadService
}

func NewUploadHandler(svc service.UploadService) *UploadHandler {
	return &UploadHandler{svc: svc}
}

// Upload POST /api/uploads — multipart field "file" (+ optional "kind")
func (h *UploadHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "missing file field 'file'")
		return
	}
	defer file.Close()

	kind := strings.TrimSpace(c.PostForm("kind"))
	contentType := header.Header.Get("Content-Type")

	out, err := h.svc.Upload(
		c.Request.Context(),
		kind,
		header.Filename,
		contentType,
		file,
		header.Size,
	)
	if err != nil {
		writeUploadError(c, err)
		return
	}

	httpx.OK(c, out)
}

// Presign POST /api/uploads/presign
func (h *UploadHandler) Presign(c *gin.Context) {
	var req dto.PresignUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	out, err := h.svc.Presign(c.Request.Context(), req)
	if err != nil {
		writeUploadError(c, err)
		return
	}

	httpx.OK(c, out)
}

// Delete DELETE /api/uploads — body: { "key" } หรือ { "file_url" }
func (h *UploadHandler) Delete(c *gin.Context) {
	var req dto.DeleteUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	if strings.TrimSpace(req.Key) == "" && strings.TrimSpace(req.FileURL) == "" {
		httpx.Fail(c, http.StatusBadRequest, "provide key or file_url")
		return
	}

	out, err := h.svc.Delete(c.Request.Context(), req)
	if err != nil {
		writeUploadError(c, err)
		return
	}

	httpx.OK(c, out)
}

func writeUploadError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrUploadNotConfigured):
		httpx.Fail(c, http.StatusServiceUnavailable, "S3 is not configured. Set AWS_* env vars on the backend.")
	case errors.Is(err, service.ErrInvalidUploadKind):
		httpx.Fail(c, http.StatusBadRequest, "kind must be image, video, pdf, or file")
	case errors.Is(err, service.ErrInvalidUploadMIMEType):
		httpx.Fail(c, http.StatusBadRequest, "content_type is not allowed for this kind")
	case errors.Is(err, service.ErrUploadTooLarge):
		httpx.Fail(c, http.StatusRequestEntityTooLarge, "ไฟล์ใหญ่เกิน 500MB กรุณาบีบอัดหรือเลือกไฟล์ที่เล็กลง")
	case errors.Is(err, service.ErrInvalidUploadTarget):
		httpx.Fail(c, http.StatusBadRequest, "key/file_url must point to an object under uploads/")
	default:
		httpx.Fail(c, http.StatusInternalServerError, err.Error())
	}
}
