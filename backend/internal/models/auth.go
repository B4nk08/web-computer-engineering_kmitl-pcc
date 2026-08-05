package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func ensureUUID(id *uuid.UUID) {
	if *id == uuid.Nil {
		*id = uuid.New()
	}
}

////////////////////////////////////////////////////////////
// AUTH
////////////////////////////////////////////////////////////

type UserRole string

const (
	RoleExternal UserRole = "external"
	RoleStudent  UserRole = "student"
	RoleTeacher  UserRole = "teacher"
	RoleAdmin    UserRole = "admin"
)

type User struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	GoogleSub   *string   `gorm:"uniqueIndex;size:255" json:"google_sub,omitempty"`
	Email       string    `gorm:"uniqueIndex;size:255;not null" json:"email"`
	// PasswordHash เป็น null ได้ (ผู้ใช้ที่สมัครผ่าน Google อาจไม่มีรหัสผ่าน)
	PasswordHash *string   `gorm:"size:255" json:"-"`
	DisplayName  string    `gorm:"size:255" json:"display_name"`
	AvatarURL    string    `gorm:"type:text" json:"avatar_url"`
	Role         UserRole  `gorm:"type:varchar(20);not null;default:'external'" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&u.ID)
	return nil
}

func (User) TableName() string { return "users" }

type WhitelistRole string

const (
	WhitelistStudent WhitelistRole = "student"
	WhitelistTeacher WhitelistRole = "teacher"
	WhitelistAdmin   WhitelistRole = "admin"
)

type CEWhitelist struct {
	ID          uuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	Email       string        `gorm:"uniqueIndex;size:255;not null" json:"email"`
	StudentCode *string       `gorm:"uniqueIndex;size:64" json:"student_code,omitempty"`
	FullName    string        `gorm:"size:255" json:"full_name"`
	Role        WhitelistRole `gorm:"type:varchar(20);not null;default:'student'" json:"role"`
	CreatedBy   *uuid.UUID    `gorm:"type:uuid;index" json:"created_by,omitempty"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

func (c *CEWhitelist) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&c.ID)
	return nil
}

func (CEWhitelist) TableName() string { return "ce_whitelist" }
