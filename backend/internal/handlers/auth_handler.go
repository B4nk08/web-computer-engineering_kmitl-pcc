package handlers

import (
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// AuthHandler แปลง HTTP request ↔ auth service
// implementations แยกไฟล์: auth_register.go, auth_login.go, auth_google.go, auth_me.go, auth_token.go
type AuthHandler struct {
	auth  service.AuthService
	users repository.UserRepository
}

func NewAuthHandler(auth service.AuthService, users repository.UserRepository) *AuthHandler {
	return &AuthHandler{auth: auth, users: users}
}
