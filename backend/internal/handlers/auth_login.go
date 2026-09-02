package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// Login POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.auth.Login(req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidCredentials):
			httpx.Fail(c, http.StatusUnauthorized, err.Error())
		case errors.Is(err, service.ErrOAuthOnlyAccount):
			httpx.Fail(c, http.StatusConflict, err.Error())
		default:
			httpx.Fail(c, http.StatusInternalServerError, "failed to login")
		}
		return
	}
	httpx.OK(c, res)
}
