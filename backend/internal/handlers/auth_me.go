package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// Me GET /api/auth/me (ต้อง auth) — คืนข้อมูลผู้ใช้ + sync role จาก whitelist
func (h *AuthHandler) Me(c *gin.Context) {
	userID, ok := middleware.UserIDFromContext(c)
	if !ok {
		httpx.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	user, err := h.auth.SyncUserRole(userID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			httpx.Fail(c, http.StatusNotFound, "user not found")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to load user")
		return
	}
	httpx.OK(c, user)
}
