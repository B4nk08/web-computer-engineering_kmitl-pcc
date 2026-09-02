package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// Register POST /api/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.auth.Register(req)
	if err != nil {
		if errors.Is(err, service.ErrEmailTaken) {
			httpx.Fail(c, http.StatusConflict, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to register")
		return
	}
	httpx.Created(c, res)
}
