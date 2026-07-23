package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/handlers"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB, cfg config.Config) *gin.Engine {
	gin.SetMode(cfg.GinMode)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL, "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	h := handlers.New(db)

	r.GET("/health", h.Health)
	api := r.Group("/api")
	{
		api.GET("/health", h.Health)
	}

	return r
}
