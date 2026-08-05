package main

import (
	"context"
	"log"

	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/database"
	"github.com/kmitl-pcc/ce-web/backend/internal/handlers"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/googleauth"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/s3x"
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
	quizRepo := repository.NewQuizRepository(db)
	examRepo := repository.NewExamRepository(db)

	// S3 (optional — upload API returns 503 if not configured)
	var s3Client *s3x.Client
	if cfg.AWSS3Bucket != "" && cfg.AWSRegion != "" && cfg.AWSAccessKeyID != "" && cfg.AWSSecretAccessKey != "" {
		client, err := s3x.New(context.Background(), s3x.Config{
			Region:          cfg.AWSRegion,
			Bucket:          cfg.AWSS3Bucket,
			AccessKeyID:     cfg.AWSAccessKeyID,
			SecretAccessKey: cfg.AWSSecretAccessKey,
			PublicBaseURL:   cfg.AWSS3PublicBaseURL,
			Endpoint:        cfg.AWSEndpoint,
		})
		if err != nil {
			log.Printf("warning: S3 client init failed (uploads disabled): %v", err)
		} else {
			s3Client = client
			log.Printf("S3 uploads enabled (bucket=%s region=%s)", cfg.AWSS3Bucket, cfg.AWSRegion)
		}
	} else {
		log.Printf("S3 uploads disabled (set AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)")
	}

	// services
	authService := service.NewAuthService(userRepo, whitelistRepo, tokens, googleVerifier)
	contentService := service.NewContentService(contentRepo)
	quizService := service.NewQuizService(quizRepo)
	examService := service.NewExamService(examRepo)
	uploadService := service.NewUploadService(s3Client)

	// handlers
	deps := router.Dependencies{
		Health:  handlers.NewHealthHandler(db),
		Auth:    handlers.NewAuthHandler(authService, userRepo),
		Content: handlers.NewContentHandler(contentService),
		Quiz:    handlers.NewQuizHandler(quizService),
		Exam:    handlers.NewExamHandler(examService),
		Upload:  handlers.NewUploadHandler(uploadService),
		Tokens:  tokens,
	}

	r := router.Setup(cfg, deps)
	log.Printf("backend listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
