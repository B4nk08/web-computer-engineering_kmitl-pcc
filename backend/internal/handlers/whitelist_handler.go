package handlers

import (
	"bytes"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/httpx"
	"github.com/kmitl-pcc/ce-web/backend/internal/service"
)

const (
	maxWhitelistImportBytes = 5 << 20 // 5MB
	maxWhitelistImportRows  = 5000
)

// WhitelistHandler API จัดการรายชื่อ ce_whitelist — เพิ่มทีละคน หรือนำเข้าไฟล์ CSV (preview/commit)
type WhitelistHandler struct {
	whitelist service.WhitelistService
}

func NewWhitelistHandler(whitelist service.WhitelistService) *WhitelistHandler {
	return &WhitelistHandler{whitelist: whitelist}
}

// Create POST /api/whitelist — เพิ่มรายชื่อทีละคน (JSON: email, full_name, role?)
func (h *WhitelistHandler) Create(c *gin.Context) {
	var req dto.WhitelistCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	item, err := h.whitelist.Create(req)
	if err != nil {
		h.failWrite(c, err)
		return
	}
	httpx.Created(c, item)
}

// ImportPreview POST /api/whitelist/import/preview
// multipart/form-data field "file" — parse + validate ทุกแถว แต่ไม่เขียน DB
func (h *WhitelistHandler) ImportPreview(c *gin.Context) {
	rows, err := h.parseCSV(c)
	if err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	if len(rows) == 0 {
		httpx.Fail(c, http.StatusBadRequest, "CSV file has no data rows")
		return
	}

	result, err := h.whitelist.Preview(rows)
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to preview import")
		return
	}
	httpx.OK(c, result)
}

// ImportCommit POST /api/whitelist/import/commit
// JSON body: { "rows": [...] } — รายการที่ผ่านการตรวจสอบ/เลือกไว้จากหน้า preview แล้ว
func (h *WhitelistHandler) ImportCommit(c *gin.Context) {
	var req dto.WhitelistImportCommitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	if len(req.Rows) == 0 {
		httpx.Fail(c, http.StatusBadRequest, "rows must not be empty")
		return
	}
	if len(req.Rows) > maxWhitelistImportRows {
		httpx.Fail(c, http.StatusBadRequest, fmt.Sprintf("too many rows (max %d)", maxWhitelistImportRows))
		return
	}

	result, err := h.whitelist.Commit(req.Rows)
	if err != nil {
		httpx.Fail(c, http.StatusInternalServerError, "failed to import whitelist")
		return
	}
	httpx.OK(c, result)
}

func (h *WhitelistHandler) failWrite(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrWhitelistDuplicateEmail):
		httpx.Fail(c, http.StatusConflict, "อีเมลนี้มีอยู่ในรายชื่อแล้ว — ใช้ import CSV (อัปเดต) หรือเลือกอีเมลอื่น")
	case errors.Is(err, service.ErrWhitelistInvalidEmail),
		errors.Is(err, service.ErrWhitelistNameRequired),
		errors.Is(err, service.ErrWhitelistInvalidRole):
		httpx.Fail(c, http.StatusBadRequest, err.Error())
	default:
		httpx.Fail(c, http.StatusInternalServerError, "failed to create whitelist entry")
	}
}

// parseCSV อ่านไฟล์จาก multipart field "file"
// รองรับคอลัมน์: email (required), full_name หรือ name (required), role (optional — ว่าง = student)
// ลำดับคอลัมน์ไม่สำคัญ เพราะอ่านตาม header row
func (h *WhitelistHandler) parseCSV(c *gin.Context) ([]dto.WhitelistImportRow, error) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxWhitelistImportBytes)

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		return nil, errors.New("missing file field 'file'")
	}
	defer file.Close()

	raw, err := io.ReadAll(file)
	if err != nil {
		return nil, errors.New("failed to read uploaded file (may exceed 5MB limit)")
	}
	// Excel export ภาษาไทยมักมี UTF-8 BOM ติดมา — ตัดออกก่อน parse
	raw = bytes.TrimPrefix(raw, []byte("\xef\xbb\xbf"))

	reader := csv.NewReader(bytes.NewReader(raw))
	reader.TrimLeadingSpace = true
	reader.FieldsPerRecord = -1

	records, err := reader.ReadAll()
	if err != nil {
		return nil, errors.New("invalid CSV format")
	}
	if len(records) == 0 {
		return nil, errors.New("CSV file is empty")
	}

	colIndex := make(map[string]int, len(records[0]))
	for i, col := range records[0] {
		colIndex[strings.ToLower(strings.TrimSpace(col))] = i
	}

	emailIdx, ok := colIndex["email"]
	if !ok {
		return nil, errors.New("missing required column: email")
	}
	nameIdx, ok := colIndex["full_name"]
	if !ok {
		nameIdx, ok = colIndex["name"]
	}
	if !ok {
		return nil, errors.New("missing required column: full_name")
	}
	roleIdx, hasRole := colIndex["role"]

	dataRecords := records[1:]
	if len(dataRecords) > maxWhitelistImportRows {
		return nil, fmt.Errorf("too many rows (max %d)", maxWhitelistImportRows)
	}

	rows := make([]dto.WhitelistImportRow, 0, len(dataRecords))
	for i, record := range dataRecords {
		if isBlankRecord(record) {
			continue
		}

		row := dto.WhitelistImportRow{Line: i + 2} // +1: 0-index, +1: header row
		if emailIdx < len(record) {
			row.Email = record[emailIdx]
		}
		if nameIdx < len(record) {
			row.FullName = record[nameIdx]
		}
		if hasRole && roleIdx < len(record) {
			row.Role = record[roleIdx]
		}
		rows = append(rows, row)
	}

	return rows, nil
}

func isBlankRecord(record []string) bool {
	for _, v := range record {
		if strings.TrimSpace(v) != "" {
			return false
		}
	}
	return true
}
