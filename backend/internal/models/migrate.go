package models

// All returns every model used by AutoMigrate (order matters for FKs loosely).
func All() []any {
	return []any{
		&User{},
		&CEWhitelist{},
		&Content{},
		&News{},
		&Quiz{},
		&QuizQuestion{},
		&QuizOption{},
		&QuizAttempt{},
		&ExamQuestion{},
		&ExamSetting{},
		&ExamCredential{},
		&ExamAttempt{},
	}
}
