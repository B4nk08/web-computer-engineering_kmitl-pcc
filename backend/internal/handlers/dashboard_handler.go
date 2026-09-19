package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

type DashboardHandler struct {
	dashboard service.DashboardService
}

func NewDashboardHandler(dashboard service.DashboardService) *DashboardHandler {
	return &DashboardHandler{dashboard: dashboard}
}

func (h *DashboardHandler) Get(c *gin.Context) {
	item, err := h.dashboard.Get()
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to load dashboard")
		return
	}
	httpx.OK(c, item)
}

func actorFromContext(c *gin.Context) (name string, id *uuid.UUID) {
	if display, ok := middleware.NameFromContext(c); ok && display != "" {
		name = display
	} else if email, ok := middleware.EmailFromContext(c); ok && email != "" {
		name = email
	} else {
		name = "แอดมิน"
	}
	if idStr, ok := middleware.UserIDFromContext(c); ok {
		parsed, err := uuid.Parse(idStr)
		if err == nil {
			id = &parsed
		}
	}
	return name, id
}

func recordDelete(recorder service.ActivityRecorder, c *gin.Context, targetType, title string) {
	if recorder == nil || title == "" {
		return
	}
	name, id := actorFromContext(c)
	_ = recorder.RecordDelete(targetType, title, name, id)
}
