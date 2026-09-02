package service

import (
	"errors"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/hashx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

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
