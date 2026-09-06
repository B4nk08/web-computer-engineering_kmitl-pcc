// Package service รวม business logic (orchestrate repository + utils)
package service

import (
	"context"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// AuthService นิยาม use case ด้าน authentication
// implementations แยกไฟล์: auth_register.go, auth_login.go, auth_google.go, auth_me.go, auth_helpers.go
type AuthService interface {
	Register(req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req dto.LoginRequest) (*dto.AuthResponse, error)
	GoogleLogin(ctx context.Context, req dto.GoogleLoginRequest) (*dto.AuthResponse, error)
	SyncUserRole(userID string) (*dto.UserResponse, error)
}

type authService struct {
	users     repository.UserRepository
	whitelist repository.WhitelistRepository
	tokens    *tokenx.Manager
	google    *googleauth.Verifier
}

func NewAuthService(
	users repository.UserRepository,
	whitelist repository.WhitelistRepository,
	tokens *tokenx.Manager,
	google *googleauth.Verifier,
) AuthService {
	return &authService{users: users, whitelist: whitelist, tokens: tokens, google: google}
}
