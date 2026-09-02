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
	Health    *handlers.HealthHandler
	Auth      *handlers.AuthHandler
	Content   *handlers.ContentHandler
	Quiz      *handlers.QuizHandler
	Exam      *handlers.ExamHandler
	Upload    *handlers.UploadHandler
	Students  *handlers.StudentHandler
	Whitelist *handlers.WhitelistHandler
	Tokens    *tokenx.Manager
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
			// สำหรับเทส Postman — ได้ JWT เหมือน login
			auth.POST("/token", deps.Auth.GetToken)
			auth.POST("/get-token", deps.Auth.GetToken)
			auth.POST("/google", deps.Auth.GoogleLogin)
			auth.GET("/me", middleware.RequireAuth(deps.Tokens), deps.Auth.Me)
		}

		// ---------- Students (รายชื่อจาก ce_whitelist) ----------
		students := api.Group("/students")
		students.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
		{
			students.GET("", deps.Students.List)
		}

		// ---------- Whitelist (จัดการรายชื่อ ce_whitelist — เพิ่มทีละคน / นำเข้า CSV) ----------
		whitelist := api.Group("/whitelist")
		whitelist.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
		{
			whitelist.POST("", deps.Whitelist.Create)
			whitelist.POST("/import/preview", deps.Whitelist.ImportPreview)
			whitelist.POST("/import/commit", deps.Whitelist.ImportCommit)
		}

		// ---------- Contents (หลักสูตร / บุคลากร / ผลงาน / สื่อ / รับสมัคร / อาชีพ) ----------
		// ตอนนี้เปิดสาธารณะเพื่อทดสอบ Postman — เปิด auth ทีหลังโดย uncomment บรรทัดด้านล่าง
		contents := api.Group("/contents")
		{
			contents.GET("", deps.Content.List)
			contents.GET("/:id", deps.Content.Get)

			// write := contents.Group("")
			// write.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
			contents.POST("", deps.Content.Create)
			contents.PUT("/:id", deps.Content.Update)
			contents.DELETE("/:id", deps.Content.Delete)
		}

		// S3 presigned uploads (admin)
		// uploads := api.Group("/uploads")
		// uploads.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
		uploads := api.Group("/uploads")
		{
			uploads.POST("/presign", deps.Upload.Presign)
		}

		// ---------- Quiz ----------
		quizzes := api.Group("/quizzes")
		{
			// public / play
			quizzes.GET("", deps.Quiz.List)
			quizzes.GET("/:id/play", deps.Quiz.Play)
			quizzes.POST("/:id/attempts", deps.Quiz.SubmitAttempt)

			// admin (เปิดไว้ก่อน — ใส่ auth ได้ทีหลัง)
			// staff := quizzes.Group("")
			// staff.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
			quizzes.POST("", deps.Quiz.Create)
			quizzes.GET("/:id", deps.Quiz.GetAdmin)
			quizzes.PUT("/:id", deps.Quiz.Update)
			quizzes.DELETE("/:id", deps.Quiz.Delete)
			quizzes.POST("/:id/questions", deps.Quiz.AddQuestion)
			quizzes.GET("/:id/attempts", deps.Quiz.ListAttempts)
		}
		quizQuestions := api.Group("/quiz-questions")
		{
			quizQuestions.PUT("/:id", deps.Quiz.UpdateQuestion)
			quizQuestions.DELETE("/:id", deps.Quiz.DeleteQuestion)
		}

		// ---------- Exit Exam ----------
		exams := api.Group("/exams")
		{
			// student flow
			exams.POST("/start", deps.Exam.Start)
			exams.POST("/attempts/:id/submit", deps.Exam.Submit)

			// subjects (กลุ่มวิชา/track) — GET เปิดสาธารณะให้เลือกหน้าแรกได้, เขียนได้เฉพาะ teacher/admin
			exams.GET("/subjects", deps.Exam.ListSubjects)
			examSubjects := exams.Group("/subjects")
			examSubjects.Use(middleware.RequireAuth(deps.Tokens), middleware.RequireRole("teacher", "admin"))
			{
				examSubjects.POST("", deps.Exam.CreateSubject)
				examSubjects.PUT("/:id", deps.Exam.UpdateSubject)
				examSubjects.DELETE("/:id", deps.Exam.DeleteSubject)
			}

			// admin bank / settings / credentials / scores
			exams.GET("/questions", deps.Exam.ListQuestions)
			exams.POST("/questions", deps.Exam.CreateQuestion)
			exams.PUT("/questions/:id", deps.Exam.UpdateQuestion)
			exams.DELETE("/questions/:id", deps.Exam.DeleteQuestion)

			exams.GET("/settings", deps.Exam.ListSettings)
			exams.GET("/settings/:subject/:mode", deps.Exam.GetSetting)
			exams.PUT("/settings", deps.Exam.UpsertSetting)

			exams.GET("/credentials", deps.Exam.ListCredentials)
			exams.POST("/credentials", deps.Exam.CreateCredential)

			exams.GET("/attempts", deps.Exam.ListAttempts)
		}
	}

	return r
}
