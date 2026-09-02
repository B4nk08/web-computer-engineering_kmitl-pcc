package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// SyncUserRole ดึง user ตาม id แล้ว sync role จาก ce_whitelist
func (s *authService) SyncUserRole(userID string) (*dto.UserResponse, error) {
	id, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	user, err := s.users.FindByID(id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, err
		}
		return nil, err
	}

	role := s.resolveRole(user.Email)
	if user.Role != role {
		user.Role = role
		if err := s.users.Update(user); err != nil {
			return nil, err
		}
	}

	res := dto.NewUserResponse(user)
	return &res, nil
}
