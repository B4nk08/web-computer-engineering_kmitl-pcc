package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/handlers"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/tokenx"
)

// Dependencies รวม handler/สิ่งที่ route ต้องใช้ (inject จาก main)
type Dependencies struct {
	Health  *handlers.HealthHandler
	Auth    *handlers.AuthHandler
	Content *handlers.ContentHandler
	Tokens  *tokenx.Manager
}

func Setup(cfg config.Config, deps Dependencies) *gin.Engine {
	gin.SetMode(cfg.GinMode)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL, "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/health", deps.Health.Health)

	api := r.Group("/api")
	{
		api.GET("/health", deps.Health.Health)

		auth := api.Group("/auth")
		{
			auth.POST("/register", deps.Auth.Register)
			auth.POST("/login", deps.Auth.Login)
			auth.POST("/google", deps.Auth.GoogleLogin)
			auth.GET("/me", middleware.RequireAuth(deps.Tokens), deps.Auth.Me)
		}

		// Contents CRUD — แยกชนิดด้วย ?type=staff|video|...
		contents := api.Group("/contents")
		{
			contents.GET("", deps.Content.List)
			contents.GET("/:id", deps.Content.Get)

			// ตอนนี้ยังไม่ล็อก auth — เปิด comment ด้านล่างเมื่อพร้อมบังคับ teacher
			// write := contents.Group("")
			// write.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher"))
			// {
			// 	write.POST("", deps.Content.Create)
			// 	write.PUT("/:id", deps.Content.Update)
			// 	write.DELETE("/:id", deps.Content.Delete)
			// }
			contents.POST("", deps.Content.Create)
			contents.PUT("/:id", deps.Content.Update)
			contents.DELETE("/:id", deps.Content.Delete)
		}
	}

	return r
}
