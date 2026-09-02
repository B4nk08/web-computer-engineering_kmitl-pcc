package handlers

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// GoogleLogin POST /api/auth/google — OAuth ด้วย Google ID token
func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	var req dto.GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.auth.GoogleLogin(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrGoogleVerify) {
			log.Printf("google login verify failed: %v", err)
			httpx.Fail(c, http.StatusUnauthorized, googleVerifyMessage(err))
			return
		}
		log.Printf("google login failed: %v", err)
		httpx.Fail(c, http.StatusInternalServerError, "failed to login with google")
		return
	}
	httpx.OK(c, res)
}

func googleVerifyMessage(err error) string {
	msg := err.Error()
	switch {
	case errors.Is(err, googleauth.ErrMissingClientID) || strings.Contains(msg, googleauth.ErrMissingClientID.Error()):
		return "server missing GOOGLE_CLIENT_ID — ตั้งค่าใน .env แล้ว recreate backend"
	case errors.Is(err, googleauth.ErrAudienceMismatch) || strings.Contains(msg, googleauth.ErrAudienceMismatch.Error()):
		return "google client id mismatch — GOOGLE_CLIENT_ID ต้องตรงกับ NEXT_PUBLIC_GOOGLE_CLIENT_ID"
	case errors.Is(err, googleauth.ErrGoogleUnreachable) || strings.Contains(msg, googleauth.ErrGoogleUnreachable.Error()):
		return "backend reach Google ไม่ได้ — ตรวจ network ของ container"
	case errors.Is(err, googleauth.ErrEmailNotVerified) || strings.Contains(msg, googleauth.ErrEmailNotVerified.Error()):
		return "google email is not verified"
	default:
		return "invalid google token"
	}
}
