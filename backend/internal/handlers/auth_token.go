package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// GetToken POST /api/auth/token (และ /api/auth/get-token)
// สำหรับเทสใน Postman — logic เดียวกับ login คืน JWT
func (h *AuthHandler) GetToken(c *gin.Context) {
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
			httpx.Fail(c, http.StatusInternalServerError, "failed to get token")
		}
		return
	}

	// ตอบแบบชัด ๆ สำหรับเทส: token อยู่บนสุดใน data
	httpx.OK(c, gin.H{
		"token":      res.Token,
		"token_type": "Bearer",
		"user":       res.User,
	})
}
