package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

const maxContentUploadBytes = 50 << 20 // 50MB

// ContentHandler CRUD ตาราง contents (แยกชนิดด้วย field type)
type ContentHandler struct {
	contents service.ContentService
	uploads  service.UploadService
}

func NewContentHandler(contents service.ContentService, uploads service.UploadService) *ContentHandler {
	return &ContentHandler{contents: contents, uploads: uploads}
}

// List GET /api/contents?type=staff&published_only=true
func (h *ContentHandler) List(c *gin.Context) {
	var filter dto.ContentFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	items, err := h.contents.List(filter)
	if err != nil {
		if errors.Is(err, service.ErrInvalidContentType) {
			httpx.Fail(c, http.StatusBadRequest, "type must be one of: about_us, curriculum, staff, student_work, career_path, admissions")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to list contents")
		return
	}
	httpx.OK(c, items)
}

// Get GET /api/contents/:id
func (h *ContentHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	item, err := h.contents.GetByID(id)
	if err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to get content")
		return
	}
	httpx.OK(c, item)
}

// Create POST /api/contents
// รองรับ application/json หรือ multipart/form-data (field "file", optional "image" สำหรับ about_us)
func (h *ContentHandler) Create(c *gin.Context) {
	req, err := h.parseCreateRequest(c)
	if err != nil {
		h.failUpload(c, err)
		return
	}

	item, err := h.contents.Create(req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidContentType) {
			httpx.Fail(c, http.StatusBadRequest, "type must be one of: about_us, curriculum, staff, student_work, career_path, admissions")
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to create content")
		return
	}
	httpx.Created(c, item)
}

// Update PUT /api/contents/:id
func (h *ContentHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	req, err := h.parseUpdateRequest(c)
	if err != nil {
		h.failUpload(c, err)
		return
	}

	item, err := h.contents.Update(id, req)
	if err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to update content")
		return
	}
	httpx.OK(c, item)
}

// Delete DELETE /api/contents/:id
func (h *ContentHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.contents.Delete(id); err != nil {
		if errors.Is(err, service.ErrContentNotFound) {
			httpx.Fail(c, http.StatusNotFound, err.Error())
			return
		}
		httpx.Fail(c, http.StatusInternalServerError, "failed to delete content")
		return
	}
	httpx.OK(c, gin.H{"deleted": true})
}

func (h *ContentHandler) failUpload(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrUploadNotConfigured):
		httpx.Fail(c, http.StatusServiceUnavailable, "S3 is not configured. Set AWS_* env vars on the backend.")
	case errors.Is(err, service.ErrInvalidUploadKind), errors.Is(err, service.ErrInvalidUploadMIMEType):
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	default:
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	}
}

func (h *ContentHandler) parseCreateRequest(c *gin.Context) (dto.CreateContentRequest, error) {
	ct := c.ContentType()
	if strings.HasPrefix(ct, "multipart/form-data") {
		return h.parseCreateMultipart(c)
	}

	var req dto.CreateContentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return dto.CreateContentRequest{}, err
	}
	return req, nil
}

func (h *ContentHandler) parseUpdateRequest(c *gin.Context) (dto.UpdateContentRequest, error) {
	ct := c.ContentType()
	if strings.HasPrefix(ct, "multipart/form-data") {
		return h.parseUpdateMultipart(c)
	}

	var req dto.UpdateContentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return dto.UpdateContentRequest{}, err
	}
	return req, nil
}

func (h *ContentHandler) parseCreateMultipart(c *gin.Context) (dto.CreateContentRequest, error) {
	if err := c.Request.ParseMultipartForm(maxContentUploadBytes); err != nil {
		return dto.CreateContentRequest{}, err
	}

	req := dto.CreateContentRequest{
		Type:      strings.TrimSpace(c.PostForm("type")),
		Title:     strings.TrimSpace(c.PostForm("title")),
		Body:      c.PostForm("body"),
		FileURL:   strings.TrimSpace(c.PostForm("file_url")),
		SortOrder: parseFormInt(c.PostForm("sort_order"), 0),
	}
	if v := strings.TrimSpace(c.PostForm("is_published")); v != "" {
		published := v == "true" || v == "1"
		req.IsPublished = &published
	}
	if extraRaw := strings.TrimSpace(c.PostForm("extra")); extraRaw != "" {
		req.Extra = json.RawMessage(extraRaw)
	}

	fileURL, err := h.uploadFormFile(c, "file", "")
	if err != nil {
		return dto.CreateContentRequest{}, err
	}
	if fileURL != "" {
		req.FileURL = fileURL
	}

	imageURL, err := h.uploadFormFile(c, "image", "image")
	if err != nil {
		return dto.CreateContentRequest{}, err
	}
	if imageURL != "" {
		req.Extra = mergeExtraURL(req.Extra, "image_url", imageURL)
	}

	return req, nil
}

func (h *ContentHandler) parseUpdateMultipart(c *gin.Context) (dto.UpdateContentRequest, error) {
	if err := c.Request.ParseMultipartForm(maxContentUploadBytes); err != nil {
		return dto.UpdateContentRequest{}, err
	}

	req := dto.UpdateContentRequest{}
	if v := c.PostForm("title"); c.Request.Form.Has("title") {
		req.Title = &v
	}
	if c.Request.Form.Has("body") {
		v := c.PostForm("body")
		req.Body = &v
	}
	if c.Request.Form.Has("file_url") {
		v := strings.TrimSpace(c.PostForm("file_url"))
		req.FileURL = &v
	}
	if c.Request.Form.Has("sort_order") {
		n := parseFormInt(c.PostForm("sort_order"), 0)
		req.SortOrder = &n
	}
	if v := strings.TrimSpace(c.PostForm("is_published")); v != "" {
		published := v == "true" || v == "1"
		req.IsPublished = &published
	}
	if extraRaw := strings.TrimSpace(c.PostForm("extra")); extraRaw != "" {
		req.Extra = json.RawMessage(extraRaw)
	}

	fileURL, err := h.uploadFormFile(c, "file", "")
	if err != nil {
		return dto.UpdateContentRequest{}, err
	}
	if fileURL != "" {
		req.FileURL = &fileURL
	}

	imageURL, err := h.uploadFormFile(c, "image", "image")
	if err != nil {
		return dto.UpdateContentRequest{}, err
	}
	if imageURL != "" {
		req.Extra = mergeExtraURL(req.Extra, "image_url", imageURL)
	}

	return req, nil
}

func (h *ContentHandler) uploadFormFile(c *gin.Context, field, forceKind string) (string, error) {
	file, header, err := c.Request.FormFile(field)
	if err != nil {
		if errors.Is(err, http.ErrMissingFile) {
			return "", nil
		}
		// gin/http may wrap missing file differently
		if errors.Is(err, multipart.ErrMessageTooLarge) {
			return "", err
		}
		if strings.Contains(err.Error(), "no such file") {
			return "", nil
		}
		return "", err
	}
	defer file.Close()

	contentType := header.Header.Get("Content-Type")
	if contentType == "" || contentType == "application/octet-stream" {
		contentType = sniffContentType(header.Filename, file)
		if seeker, ok := file.(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}
	}

	kind := forceKind
	if kind == "" {
		kind = service.KindFromContentType(contentType)
	}

	return h.uploads.Put(c.Request.Context(), kind, header.Filename, contentType, file)
}

func sniffContentType(filename string, r io.Reader) string {
	buf := make([]byte, 512)
	n, _ := io.ReadFull(r, buf)
	if n > 0 {
		detected := http.DetectContentType(buf[:n])
		if detected != "application/octet-stream" {
			return detected
		}
	}
	lower := strings.ToLower(filename)
	switch {
	case strings.HasSuffix(lower, ".pdf"):
		return "application/pdf"
	case strings.HasSuffix(lower, ".png"):
		return "image/png"
	case strings.HasSuffix(lower, ".jpg"), strings.HasSuffix(lower, ".jpeg"):
		return "image/jpeg"
	case strings.HasSuffix(lower, ".webp"):
		return "image/webp"
	case strings.HasSuffix(lower, ".gif"):
		return "image/gif"
	case strings.HasSuffix(lower, ".mp4"):
		return "video/mp4"
	case strings.HasSuffix(lower, ".webm"):
		return "video/webm"
	default:
		return "application/octet-stream"
	}
}

func parseFormInt(raw string, fallback int) int {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fallback
	}
	n, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}
	return n
}

func mergeExtraURL(extra json.RawMessage, key, url string) json.RawMessage {
	obj := map[string]any{}
	if len(extra) > 0 {
		_ = json.Unmarshal(extra, &obj)
	}
	obj[key] = url
	out, err := json.Marshal(obj)
	if err != nil {
		return extra
	}
	return out
}
