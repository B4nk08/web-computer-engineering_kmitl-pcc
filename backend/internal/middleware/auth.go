// Package middleware รวม gin middleware ที่ใช้ร่วมกัน
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
)

const (
	ctxUserID = "auth_user_id"
	ctxEmail  = "auth_email"
	ctxRole   = "auth_role"
)

// RequireAuth ตรวจ Bearer token และฝังข้อมูลผู้ใช้ลง context
func RequireAuth(tokens *tokenx.Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			httpx.Fail(c, http.StatusUnauthorized, "missing bearer token")
			return
		}

		claims, err := tokens.Parse(parts[1])
		if err != nil {
			httpx.Fail(c, http.StatusUnauthorized, "invalid or expired token")
			return
		}

		c.Set(ctxUserID, claims.UserID.String())
		c.Set(ctxEmail, claims.Email)
		c.Set(ctxRole, claims.Role)
		c.Next()
	}
}

// RequireRole อนุญาตเฉพาะ role ที่กำหนด (ต้องใช้หลัง RequireAuth)
func RequireRole(roles ...string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(c *gin.Context) {
		role, _ := RoleFromContext(c)
		if _, ok := allowed[role]; !ok {
			httpx.Fail(c, http.StatusForbidden, "insufficient permission")
			return
		}
		c.Next()
	}
}

// UserIDFromContext ดึง user id ที่ middleware ฝังไว้
func UserIDFromContext(c *gin.Context) (string, bool) {
	v, ok := c.Get(ctxUserID)
	if !ok {
		return "", false
	}
	id, ok := v.(string)
	return id, ok
}

// RoleFromContext ดึง role ที่ middleware ฝังไว้
func RoleFromContext(c *gin.Context) (string, bool) {
	v, ok := c.Get(ctxRole)
	if !ok {
		return "", false
	}
	role, ok := v.(string)
	return role, ok
}
