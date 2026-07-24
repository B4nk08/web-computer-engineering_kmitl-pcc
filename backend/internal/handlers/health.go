package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// HealthHandler ตรวจสถานะ service + database
type HealthHandler struct {
	db *gorm.DB
}

func NewHealthHandler(db *gorm.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

func (h *HealthHandler) Health(c *gin.Context) {
	dbStatus := "ok"
	if sqlDB, err := h.db.DB(); err != nil || sqlDB.Ping() != nil {
		dbStatus = "error"
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "ok",
		"service":   "ce-backend",
		"database":  dbStatus,
		"timestamp": time.Now().UTC(),
	})
}
