package handlers

import (
	"errors"
	"net/http"

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

// Presign POST /api/uploads/presign
func (h *UploadHandler) Presign(c *gin.Context) {
	var req dto.PresignUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	out, err := h.svc.Presign(c.Request.Context(), req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUploadNotConfigured):
			httpx.Fail(c, http.StatusServiceUnavailable, "S3 is not configured. Set AWS_* env vars on the backend.")
		case errors.Is(err, service.ErrInvalidUploadKind):
			httpx.Fail(c, http.StatusBadRequest, "kind must be image, video, pdf, or file")
		case errors.Is(err, service.ErrInvalidUploadMIMEType):
			httpx.Fail(c, http.StatusBadRequest, "content_type is not allowed for this kind")
		default:
			httpx.Fail(c, http.StatusInternalServerError, err.Error())
		}
		return
	}

	httpx.OK(c, out)
}
