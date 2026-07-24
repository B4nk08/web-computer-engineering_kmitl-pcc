package config

import (
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

// Config รวมค่าตั้งค่าทั้งหมดของ backend (อ่านจาก env / .env)
type Config struct {
	// Server
	Port    string
	GinMode string

	// Database
	DatabaseURL string

	// Frontend
	FrontendURL string

	// Auth
	JWTSecret      string
	JWTExpireHours int

	// Google OAuth
	GoogleClientID string
}

func Load() Config {
	// โหลด .env จาก root โปรเจกต์ (ไฟล์เดียวทั้งระบบ)
	_ = godotenv.Load(
		".env",
		filepath.Join("..", ".env"),
	)

	return Config{
		Port:    getEnv("PORT", "8080"),
		GinMode: getEnv("GIN_MODE", "debug"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://ce:ce@localhost:5433/ce_web?sslmode=disable"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),

		JWTSecret:      getEnv("JWT_SECRET", "dev-insecure-secret-change-me"),
		JWTExpireHours: getEnvInt("JWT_EXPIRE_HOURS", 72),

		GoogleClientID: getEnv("GOOGLE_CLIENT_ID", ""),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value := os.Getenv(key); value != "" {
		if n, err := strconv.Atoi(value); err == nil {
			return n
		}
	}
	return fallback
}
