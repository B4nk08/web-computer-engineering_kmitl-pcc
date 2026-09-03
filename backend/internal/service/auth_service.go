// Package service รวม business logic (orchestrate repository + utils)
package service

import (
	"context"
	"errors"
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/hashx"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// Error กลางของ auth (handler เอาไป map เป็น HTTP status)
var (
	ErrEmailTaken         = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrOAuthOnlyAccount   = errors.New("account uses google sign-in")
	ErrGoogleVerify       = errors.New("google verification failed")
)

// AuthService นิยาม use case ด้าน authentication
type AuthService interface {
	Register(req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req dto.LoginRequest) (*dto.AuthResponse, error)
	GoogleLogin(ctx context.Context, req dto.GoogleLoginRequest) (*dto.AuthResponse, error)
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

// Register สมัครสมาชิกด้วยอีเมล/รหัสผ่าน แล้วกำหนด role จาก whitelist
func (s *authService) Register(req dto.RegisterRequest) (*dto.AuthResponse, error) {
	email := normalizeEmail(req.Email)

	if _, err := s.users.FindByEmail(email); err == nil {
		return nil, ErrEmailTaken
	} else if !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}

	hashed, err := hashx.Hash(req.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        email,
		PasswordHash: &hashed,
		DisplayName:  req.DisplayName,
		Role:         s.resolveRole(email),
	}
	if err := s.users.Create(user); err != nil {
		return nil, err
	}

	return s.buildAuthResponse(user)
}

// Login เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน
func (s *authService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	email := normalizeEmail(req.Email)

	user, err := s.users.FindByEmail(email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	// บัญชีที่สมัครผ่าน Google จะไม่มีรหัสผ่าน
	if user.PasswordHash == nil {
		return nil, ErrOAuthOnlyAccount
	}
	if !hashx.Compare(*user.PasswordHash, req.Password) {
		return nil, ErrInvalidCredentials
	}

	return s.buildAuthResponse(user)
}

// GoogleLogin ยืนยัน id_token กับ Google → สร้าง/หา user → sync role จาก whitelist
func (s *authService) GoogleLogin(ctx context.Context, req dto.GoogleLoginRequest) (*dto.AuthResponse, error) {
	payload, err := s.google.Verify(ctx, req.IDToken)
	if err != nil {
		return nil, ErrGoogleVerify
	}

	email := normalizeEmail(payload.Email)

	// 1) หา user จาก google_sub ก่อน
	user, err := s.users.FindByGoogleSub(payload.Sub)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}

	// 2) ถ้าไม่เจอ ลองหาจากอีเมล (เคยสมัครด้วยรหัสผ่านมาก่อน → link google)
	if user == nil {
		existing, findErr := s.users.FindByEmail(email)
		switch {
		case findErr == nil:
			user = existing
		case errors.Is(findErr, repository.ErrNotFound):
			user = nil
		default:
			return nil, findErr
		}
	}

	role := s.resolveRole(email)

	if user == nil {
		// สร้าง user ใหม่จาก Google
		sub := payload.Sub
		user = &models.User{
			GoogleSub:   &sub,
			Email:       email,
			DisplayName: payload.Name,
			AvatarURL:   payload.Picture,
			Role:        role,
		}
		if err := s.users.Create(user); err != nil {
			return nil, err
		}
		return s.buildAuthResponse(user)
	}

	// อัปเดตข้อมูลจาก Google + refresh role ตาม whitelist ล่าสุด
	sub := payload.Sub
	user.GoogleSub = &sub
	if user.AvatarURL == "" {
		user.AvatarURL = payload.Picture
	}
	if user.DisplayName == "" {
		user.DisplayName = payload.Name
	}
	user.Role = role
	if err := s.users.Update(user); err != nil {
		return nil, err
	}

	return s.buildAuthResponse(user)
}

// resolveRole ตัดสิน role จากตาราง ce_whitelist
// - เจอใน whitelist → student / teacher ตามที่กำหนด
// - ไม่เจอ → external
func (s *authService) resolveRole(email string) models.UserRole {
	entry, err := s.whitelist.FindByEmail(email)
	if err != nil {
		return models.RoleExternal
	}
	switch entry.Role {
	case models.WhitelistTeacher:
		return models.RoleTeacher
	case models.WhitelistAdmin:
		return models.RoleAdmin
	case models.WhitelistStudent:
		return models.RoleStudent
	default:
		return models.RoleExternal
	}
}

func (s *authService) buildAuthResponse(user *models.User) (*dto.AuthResponse, error) {
	token, err := s.tokens.Generate(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, err
	}
	return &dto.AuthResponse{
		Token: token,
		User:  dto.NewUserResponse(user),
	}, nil
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}
