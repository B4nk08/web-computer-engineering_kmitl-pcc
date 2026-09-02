package service

import (
	"errors"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/hashx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

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

	// sync role จาก whitelist ทุกครั้งที่ login
	user.Role = s.resolveRole(email)
	if err := s.users.Update(user); err != nil {
		return nil, err
	}

	return s.buildAuthResponse(user)
}
