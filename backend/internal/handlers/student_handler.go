package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

// StudentHandler API รายชื่อนักศึกษา (จาก ce_whitelist)
type StudentHandler struct {
	students service.StudentService
}

func NewStudentHandler(students service.StudentService) *StudentHandler {
	return &StudentHandler{students: students}
}

// List GET /api/students
// Query: cohort=CE01 | prefix=64 | q=ค้นหา
func (h *StudentHandler) List(c *gin.Context) {
	items, err := h.students.List(service.StudentListInput{
		Cohort: c.Query("cohort"),
		Prefix: c.Query("prefix"),
		Query:  c.Query("q"),
	})
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to list students")
		return
	}
	httpx.OK(c, items)
}
