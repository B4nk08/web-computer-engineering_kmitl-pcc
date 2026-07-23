package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRole string

const (
	RoleExternal UserRole = "external"
	RoleStudent  UserRole = "student"
	RoleTeacher  UserRole = "teacher"
)

type User struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	GoogleSub   *string   `gorm:"uniqueIndex;size:255" json:"google_sub,omitempty"`
	Email       string    `gorm:"uniqueIndex;size:255;not null" json:"email"`
	DisplayName string    `gorm:"size:255" json:"display_name"`
	AvatarURL   string    `gorm:"type:text" json:"avatar_url"`
	Role        UserRole  `gorm:"type:varchar(20);not null;default:'external'" json:"role"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type WhitelistRole string

const (
	WhitelistStudent WhitelistRole = "student"
	WhitelistTeacher WhitelistRole = "teacher"
)

type CEWhitelist struct {
	ID          uuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	Email       string        `gorm:"uniqueIndex;size:255;not null" json:"email"`
	StudentCode *string       `gorm:"uniqueIndex;size:50" json:"student_code,omitempty"`
	FullName    string        `gorm:"size:255" json:"full_name"`
	Role        WhitelistRole `gorm:"type:varchar(20);not null;default:'student'" json:"role"`
	CreatedBy   *uuid.UUID    `gorm:"type:uuid" json:"created_by,omitempty"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

func (c *CEWhitelist) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}
