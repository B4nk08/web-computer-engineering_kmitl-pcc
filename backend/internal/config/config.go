package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	FrontendURL string
	GinMode     string
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://ce:ce@localhost:5433/ce_web?sslmode=disable"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		GinMode:     getEnv("GIN_MODE", "debug"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
