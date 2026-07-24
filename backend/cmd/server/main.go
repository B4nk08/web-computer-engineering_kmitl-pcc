package main

import (
	"log"

	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/database"
	"github.com/kmitl-pcc/ce-web/backend/internal/handlers"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
	"github.com/kmitl-pcc/ce-web/backend/internal/router"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("auto migrate failed: %v", err)
	}

	// --- Dependency wiring (composition root) ---
	// utils
	tokens := tokenx.NewManager(cfg.JWTSecret, cfg.JWTExpireHours)
	googleVerifier := googleauth.NewVerifier(cfg.GoogleClientID)

	// repositories
	userRepo := repository.NewUserRepository(db)
	whitelistRepo := repository.NewWhitelistRepository(db)
	contentRepo := repository.NewContentRepository(db)

	// services
	authService := service.NewAuthService(userRepo, whitelistRepo, tokens, googleVerifier)
	contentService := service.NewContentService(contentRepo)

	// handlers
	deps := router.Dependencies{
		Health:  handlers.NewHealthHandler(db),
		Auth:    handlers.NewAuthHandler(authService, userRepo),
		Content: handlers.NewContentHandler(contentService),
		Tokens:  tokens,
	}

	r := router.Setup(cfg, deps)
	log.Printf("backend listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
