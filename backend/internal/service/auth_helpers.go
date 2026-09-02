package service

import (
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
)

// resolveRole ตัดสิน role จากตาราง ce_whitelist
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
