package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/middleware"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

type ExamHandler struct {
	exams service.ExamService
}

func NewExamHandler(exams service.ExamService) *ExamHandler {
	return &ExamHandler{exams: exams}
}

func optionalUserID(c *gin.Context) *uuid.UUID {
	idStr, ok := middleware.UserIDFromContext(c)
	if !ok {
		return nil
	}
	id, err := uuid.Parse(idStr)
	if err != nil {
		return nil
	}
	return &id
}

func (h *ExamHandler) CreateSubject(c *gin.Context) {
	var req dto.CreateExamSubjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.CreateSubject(req, optionalUserID(c))
	if err != nil {
		mapExamSubjectError(c, err, "failed to create subject")
		return
	}
	httpx.Created(c, item)
}

func (h *ExamHandler) ListSubjects(c *gin.Context) {
	includeInactive := c.Query("include_inactive") == "true"
	items, err := h.exams.ListSubjects(includeInactive)
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to list subjects")
		return
	}
	httpx.OK(c, items)
}

func (h *ExamHandler) UpdateSubject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.UpdateExamSubjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.UpdateSubject(id, req)
	if err != nil {
		mapExamSubjectError(c, err, "failed to update subject")
		return
	}
	httpx.OK(c, item)
}

// DeleteSubject soft-delete (ตั้ง is_active=false) — ไม่ลบแถวจริงเพราะข้อมูลอื่นอาจอ้างอิงอยู่
func (h *ExamHandler) DeleteSubject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.exams.DeactivateSubject(id); err != nil {
		mapExamSubjectError(c, err, "failed to deactivate subject")
		return
	}
	httpx.OK(c, gin.H{"deactivated": true})
}

func mapExamSubjectError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, service.ErrExamSubjectNotFound):
		httpx.Fail(c, http.StatusNotFound, err.Error())
	case errors.Is(err, service.ErrExamSubjectExists):
		httpx.Fail(c, http.StatusConflict, err.Error())
	case errors.Is(err, service.ErrInvalidExamSubjectCode),
		errors.Is(err, service.ErrExamSubjectNameRequired):
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	default:
		httpx.Fail(c, http.StatusInternalServerError, fallback)
	}
}

func (h *ExamHandler) CreateQuestion(c *gin.Context) {
	var req dto.CreateExamQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.CreateQuestion(req, optionalUserID(c))
	if err != nil {
		mapExamWriteError(c, err, "failed to create question")
		return
	}
	httpx.Created(c, item)
}

func (h *ExamHandler) ListQuestions(c *gin.Context) {
	var filter dto.ExamQuestionFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	items, err := h.exams.ListQuestions(filter)
	if err != nil {
		mapExamWriteError(c, err, "failed to list questions")
		return
	}
	httpx.OK(c, items)
}

func (h *ExamHandler) UpdateQuestion(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.UpdateExamQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.UpdateQuestion(id, req)
	if err != nil {
		if errors.Is(err, service.ErrExamQuestionNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		mapExamWriteError(c, err, "failed to update question")
		return
	}
	httpx.OK(c, item)
}

func (h *ExamHandler) DeleteQuestion(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.exams.DeleteQuestion(id); err != nil {
		if errors.Is(err, service.ErrExamQuestionNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete question")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}

func (h *ExamHandler) UpsertSetting(c *gin.Context) {
	var req dto.UpsertExamSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.UpsertSetting(req, optionalUserID(c))
	if err != nil {
		mapExamWriteError(c, err, "failed to save setting")
		return
	}
	httpx.OK(c, item)
}

func (h *ExamHandler) ListSettings(c *gin.Context) {
	items, err := h.exams.ListSettings()
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to list settings")
		return
	}
	httpx.OK(c, items)
}

func (h *ExamHandler) GetSetting(c *gin.Context) {
	item, err := h.exams.GetSetting(c.Param("subject"), c.Param("mode"))
	if err != nil {
		if errors.Is(err, service.ErrExamSettingNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		mapExamWriteError(c, err, "failed to get setting")
		return
	}
	httpx.OK(c, item)
}

func (h *ExamHandler) CreateCredential(c *gin.Context) {
	var req dto.CreateExamCredentialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.CreateCredential(req)
	if err != nil {
		mapExamWriteError(c, err, "failed to create credential")
		return
	}
	httpx.Created(c, item)
}

func (h *ExamHandler) ListCredentials(c *gin.Context) {
	items, err := h.exams.ListCredentials(c.Query("subject"))
	if err != nil {
		mapExamWriteError(c, err, "failed to list credentials")
		return
	}
	httpx.OK(c, items)
}

func (h *ExamHandler) Start(c *gin.Context) {
	var req dto.StartExamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.StartAttempt(req, optionalUserID(c))
	if err != nil {
		mapExamStartError(c, err)
		return
	}
	httpx.Created(c, item)
}

func (h *ExamHandler) Submit(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.SubmitExamAttemptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.exams.SubmitAttempt(id, req)
	if err != nil {
		if errors.Is(err, service.ErrExamAttemptNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		if errors.Is(err, service.ErrExamAttemptClosed) {
			httpx.Fail(c, http.StatusConflict, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to submit attempt")
		return
	}
	httpx.OK(c, item)
}

func (h *ExamHandler) ListAttempts(c *gin.Context) {
	items, err := h.exams.ListAttempts(c.Query("subject"), c.Query("mode"))
	if err != nil {
		mapExamWriteError(c, err, "failed to list attempts")
		return
	}
	httpx.OK(c, items)
}

func mapExamWriteError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, service.ErrInvalidTrackGroup):
		httpx.Fail(c, http.StatusBadRequest, "unknown subject code — ดูรายการที่ใช้ได้จาก GET /api/exams/subjects")
	case errors.Is(err, service.ErrInvalidExamMode):
		httpx.Fail(c, http.StatusBadRequest, "mode must be mock|real")
	default:
		httpx.Fail(c, http.StatusInternalServerError, fallback)
	}
}

func mapExamStartError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrInvalidTrackGroup):
		httpx.Fail(c, http.StatusBadRequest, "unknown subject code — ดูรายการที่ใช้ได้จาก GET /api/exams/subjects")
	case errors.Is(err, service.ErrExamSubjectDisabled):
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	case errors.Is(err, service.ErrInvalidExamMode):
		httpx.Fail(c, http.StatusBadRequest, "mode must be mock|real")
	case errors.Is(err, service.ErrExamSettingNotFound):
		httpx.Fail(c, http.StatusNotFound, err.Error())
	case errors.Is(err, service.ErrExamSettingDisabled),
		errors.Is(err, service.ErrExamOutsideWindow),
		errors.Is(err, service.ErrExamNotEnoughQuestions):
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	case errors.Is(err, service.ErrExamCredentialInvalid),
		errors.Is(err, service.ErrExamCredentialUsed),
		errors.Is(err, service.ErrExamCredentialExpired):
		httpx.Fail(c, http.StatusUnauthorized, err.Error())
	default:
		httpx.Fail(c, http.StatusInternalServerError, "failed to start exam")
	}
}
