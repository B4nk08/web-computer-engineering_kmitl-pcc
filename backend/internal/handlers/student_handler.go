package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
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
// นักศึกษาเห็นเฉพาะรุ่นของตนเอง — อาจารย์/แอดมินกรองได้ด้วย cohort=CE01 | prefix=64 | q=
func (h *StudentHandler) List(c *gin.Context) {
	email, _ := middleware.EmailFromContext(c)
	role, _ := middleware.RoleFromContext(c)

	items, err := h.students.ListForViewer(service.StudentViewerInput{
		Email:  email,
		Role:   role,
		Cohort: c.Query("cohort"),
		Prefix: c.Query("prefix"),
		Query:  c.Query("q"),
	})
	if err != nil {
		switch {
		case errors.Is(err, service.ErrNotCEMember):
			httpx.Fail(c, http.StatusForbidden, "not in ce_whitelist")
		case errors.Is(err, service.ErrMissingStudentCode),
			errors.Is(err, service.ErrInvalidStudentCode):
			httpx.Fail(c, http.StatusUnprocessableEntity, "student_code required")
		default:
			httpx.Fail(c, http.StatusInternalServerError, "failed to list students")
		}
		return
	}
	httpx.OK(c, items)
}
