package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// ContentHandler CRUD ตาราง contents (แยกชนิดด้วย field type)
type ContentHandler struct {
	contents service.ContentService
}

func NewContentHandler(contents service.ContentService) *ContentHandler {
	return &ContentHandler{contents: contents}
}

// List GET /api/contents?type=staff&published_only=true
func (h *ContentHandler) List(c *gin.Context) {
	var filter dto.ContentFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	items, err := h.contents.List(filter)
	if err != nil {
		if errors.Is(err, service.ErrInvalidContentType) {
			httpx.Fail(c, http.StatusBadRequest, "type must be one of: page, staff, student_work, video, career_path, admissions, curriculum")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to list contents")
		return
	}
	httpx.OK(c, items)
}

// Get GET /api/contents/:id
func (h *ContentHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	item, err := h.contents.GetByID(id)
	if err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to get content")
		return
	}
	httpx.OK(c, item)
}

// Create POST /api/contents
func (h *ContentHandler) Create(c *gin.Context) {
	var req dto.CreateContentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	item, err := h.contents.Create(req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidContentType) {
			httpx.Fail(c, http.StatusBadRequest, "type must be one of: page, staff, student_work, video, career_path, admissions, curriculum")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to create content")
		return
	}
	httpx.Created(c, item)
}

// Update PUT /api/contents/:id
func (h *ContentHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	var req dto.UpdateContentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	item, err := h.contents.Update(id, req)
	if err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to update content")
		return
	}
	httpx.OK(c, item)
}

// Delete DELETE /api/contents/:id
func (h *ContentHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.contents.Delete(id); err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete content")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}
