package handlers

import (
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
