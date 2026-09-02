package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// GoogleLogin ยืนยัน id_token กับ Google → สร้าง/หา user → sync role จาก whitelist
func (s *authService) GoogleLogin(ctx context.Context, req dto.GoogleLoginRequest) (*dto.AuthResponse, error) {
	payload, err := s.google.Verify(ctx, req.IDToken)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrGoogleVerify, err)
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
