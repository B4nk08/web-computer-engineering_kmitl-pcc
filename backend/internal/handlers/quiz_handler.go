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

type QuizHandler struct {
	quizzes service.QuizService
}

func NewQuizHandler(quizzes service.QuizService) *QuizHandler {
	return &QuizHandler{quizzes: quizzes}
}

func (h *QuizHandler) List(c *gin.Context) {
	var filter dto.QuizFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	items, err := h.quizzes.ListQuizzes(filter)
	if err != nil {
		if errors.Is(err, service.ErrInvalidQuizKind) {
			httpx.Fail(c, http.StatusBadRequest, "kind must be external or internal")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to list quizzes")
		return
	}
	httpx.OK(c, items)
}

func (h *QuizHandler) Create(c *gin.Context) {
	var req dto.CreateQuizRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.quizzes.CreateQuiz(req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidQuizKind) {
			httpx.Fail(c, http.StatusBadRequest, "kind must be external or internal")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to create quiz")
		return
	}
	httpx.Created(c, item)
}

func (h *QuizHandler) GetAdmin(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	item, err := h.quizzes.GetQuizAdmin(id)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to get quiz")
		return
	}
	httpx.OK(c, item)
}

func (h *QuizHandler) Play(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	item, err := h.quizzes.GetQuizPlay(id)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		if errors.Is(err, service.ErrQuizInactive) {
			httpx.Fail(c, http.StatusBadRequest, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to load quiz")
		return
	}
	httpx.OK(c, item)
}

func (h *QuizHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.UpdateQuizRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.quizzes.UpdateQuiz(id, req)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to update quiz")
		return
	}
	httpx.OK(c, item)
}

func (h *QuizHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.quizzes.DeleteQuiz(id); err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete quiz")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}

func (h *QuizHandler) AddQuestion(c *gin.Context) {
	quizID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.CreateQuizQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.quizzes.AddQuestion(quizID, req)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to add question")
		return
	}
	httpx.Created(c, item)
}

func (h *QuizHandler) UpdateQuestion(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.UpdateQuizQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	item, err := h.quizzes.UpdateQuestion(id, req)
	if err != nil {
		if errors.Is(err, service.ErrQuizQuestionNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to update question")
		return
	}
	httpx.OK(c, item)
}

func (h *QuizHandler) DeleteQuestion(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.quizzes.DeleteQuestion(id); err != nil {
		if errors.Is(err, service.ErrQuizQuestionNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete question")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}

func (h *QuizHandler) SubmitAttempt(c *gin.Context) {
	quizID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	var req dto.SubmitQuizAttemptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	var userID *uuid.UUID
	if idStr, ok := middleware.UserIDFromContext(c); ok {
		if id, err := uuid.Parse(idStr); err == nil {
			userID = &id
		}
	}

	item, err := h.quizzes.SubmitAttempt(quizID, userID, req)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		if errors.Is(err, service.ErrQuizInactive) {
			httpx.Fail(c, http.StatusBadRequest, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to submit attempt")
		return
	}
	httpx.Created(c, item)
}

func (h *QuizHandler) ListAttempts(c *gin.Context) {
	quizID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}
	items, err := h.quizzes.ListAttempts(quizID)
	if err != nil {
		if errors.Is(err, service.ErrQuizNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to list attempts")
		return
	}
	httpx.OK(c, items)
}
