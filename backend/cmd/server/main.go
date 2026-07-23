package main

import (
	"log"

	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/database"
	"github.com/kmitl-pcc/ce-web/backend/internal/router"
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

	r := router.Setup(db, cfg)
	log.Printf("backend listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
