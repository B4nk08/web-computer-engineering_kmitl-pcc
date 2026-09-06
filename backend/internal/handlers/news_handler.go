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

// NewsHandler CRUD ตาราง news (ข่าวสารทั่วไป / ภายใน)
type NewsHandler struct {
	news service.NewsService
}

func NewNewsHandler(news service.NewsService) *NewsHandler {
	return &NewsHandler{news: news}
}

// List GET /api/news?audience=external&published_only=true
func (h *NewsHandler) List(c *gin.Context) {
	var filter dto.NewsFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	items, err := h.news.List(filter)
	if err != nil {
		if errors.Is(err, service.ErrInvalidNewsAudience) {
			httpx.Fail(c, http.StatusBadRequest, "audience must be one of: external, internal")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to list news")
		return
	}
	httpx.OK(c, items)
}

// Get GET /api/news/:id
func (h *NewsHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	item, err := h.news.GetByID(id)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to get news")
		return
	}
	httpx.OK(c, item)
}

// Create POST /api/news
func (h *NewsHandler) Create(c *gin.Context) {
	var req dto.CreateNewsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	item, err := h.news.Create(req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidNewsAudience) {
			httpx.Fail(c, http.StatusBadRequest, "audience must be one of: external, internal")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to create news")
		return
	}
	httpx.Created(c, item)
}

// Update PUT /api/news/:id
func (h *NewsHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	var req dto.UpdateNewsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	item, err := h.news.Update(id, req)
	if err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		if errors.Is(err, service.ErrInvalidNewsAudience) {
			httpx.Fail(c, http.StatusBadRequest, "audience must be one of: external, internal")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to update news")
		return
	}
	httpx.OK(c, item)
}

// Delete DELETE /api/news/:id
func (h *NewsHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.news.Delete(id); err != nil {
		if errors.Is(err, service.ErrNewsNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete news")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}
