package service

import (
	"context"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// AuthService นิยาม use case ด้าน authentication
type AuthService interface {
	Register(req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req dto.LoginRequest) (*dto.AuthResponse, error)
	GoogleLogin(ctx context.Context, req dto.GoogleLoginRequest) (*dto.AuthResponse, error)
	// SyncUserRole อ่าน whitelist แล้วอัปเดต role ใน users (ใช้ตอน /me)
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
	return &authService{
		users:     users,
		whitelist: whitelist,
		tokens:    tokens,
		google:    google,
	}
}
