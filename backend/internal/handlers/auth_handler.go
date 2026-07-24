package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// AuthHandler แปลง HTTP request ↔ auth service
type AuthHandler struct {
	auth  service.AuthService
	users repository.UserRepository
}

func NewAuthHandler(auth service.AuthService, users repository.UserRepository) *AuthHandler {
	return &AuthHandler{auth: auth, users: users}
}

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

// GoogleLogin POST /api/auth/google
func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	var req dto.GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.auth.GoogleLogin(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrGoogleVerify) {
			httpx.Fail(c, http.StatusUnauthorized, "invalid google token")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to login with google")
		return
	}
	httpx.OK(c, res)
}

// Me GET /api/auth/me (ต้อง auth) — คืนข้อมูลผู้ใช้ปัจจุบัน
func (h *AuthHandler) Me(c *gin.Context) {
	userID, ok := middleware.UserIDFromContext(c)
	if !ok {
		httpx.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	id, err := uuid.Parse(userID)
	if err != nil {
		httpx.Fail(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	user, err := h.users.FindByID(id)
	if err != nil {
		httpx.Fail(c, http.StatusNotFound, "user not found")
		return
	}
	httpx.OK(c, dto.NewUserResponse(user))
}
