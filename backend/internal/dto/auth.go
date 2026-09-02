// Package dto รวม request/response model ของ API (แยกจาก DB model)
package dto

import "github.com/kmitl-pcc/ce-web/backend/internal/models"

// RegisterRequest สมัครสมาชิกด้วยอีเมล + รหัสผ่าน
type RegisterRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	DisplayName string `json:"display_name" binding:"required"`
}

// LoginRequest เข้าสู่ระบบด้วยอีเมล + รหัสผ่าน
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// GoogleLoginRequest เข้าสู่ระบบ/สมัครด้วย Google (ส่ง id_token จาก frontend)
type GoogleLoginRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}

// UserResponse ข้อมูลผู้ใช้ที่ปลอดภัยส่งกลับ client
type UserResponse struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	AvatarURL   string `json:"avatar_url"`
	Role        string `json:"role"`
}

// AuthResponse ผลลัพธ์หลัง login/register สำเร็จ
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// NewUserResponse map จาก model → response
func NewUserResponse(u *models.User) UserResponse {
	return UserResponse{
		ID:          u.ID.String(),
		Email:       u.Email,
		DisplayName: u.DisplayName,
		AvatarURL:   u.AvatarURL,
		Role:        string(u.Role),
	}
}
