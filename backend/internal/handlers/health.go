package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func New(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func (h *Handler) Health(c *gin.Context) {
	sqlDB, err := h.DB.DB()
	dbStatus := "ok"
	if err != nil || sqlDB.Ping() != nil {
		dbStatus = "error"
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "ok",
		"service":   "ce-backend",
		"database":  dbStatus,
		"timestamp": time.Now().UTC(),
	})
}
