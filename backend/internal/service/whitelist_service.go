package service

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/cecohort"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

// DefaultWhitelistRole role ที่ใช้เมื่อไม่ระบุ role มา (เช่น แถว CSV ที่เว้นคอลัมน์ role ว่าง)
const DefaultWhitelistRole = "student"

var allowedWhitelistRoles = map[string]bool{
	"student": true,
	"teacher": true,
	"admin":   true,
}

var (
	ErrWhitelistInvalidEmail   = errors.New("invalid email")
	ErrWhitelistNameRequired   = errors.New("full_name is required")
	ErrWhitelistInvalidRole    = errors.New("invalid role")
	ErrWhitelistDuplicateEmail = errors.New("email already exists in ce_whitelist")
)

// WhitelistService จัดการรายชื่อ ce_whitelist (เพิ่มทีละคน + นำเข้าไฟล์ CSV แบบ preview/commit)
type WhitelistService interface {
	// Create เพิ่มรายชื่อทีละคน
	Create(req dto.WhitelistCreateRequest) (dto.WhitelistEntryResponse, error)
	// Preview ตรวจสอบแถวจากไฟล์ CSV เทียบกับข้อมูลที่มีอยู่ — ไม่เขียน DB
	Preview(rows []dto.WhitelistImportRow) (dto.WhitelistImportPreviewResponse, error)
	// Commit เขียนแถวที่เลือกไว้ (จากหน้า preview) ลง DB จริง
	Commit(rows []dto.WhitelistImportRow) (dto.WhitelistImportResult, error)
}

type whitelistService struct {
	whitelist repository.WhitelistRepository
}

func NewWhitelistService(whitelist repository.WhitelistRepository) WhitelistService {
	return &whitelistService{whitelist: whitelist}
}

func (s *whitelistService) Create(req dto.WhitelistCreateRequest) (dto.WhitelistEntryResponse, error) {
	email, err := normalizeWhitelistEmail(req.Email)
	if err != nil {
		return dto.WhitelistEntryResponse{}, err
	}

	fullName := strings.TrimSpace(req.FullName)
	if fullName == "" {
		return dto.WhitelistEntryResponse{}, ErrWhitelistNameRequired
	}

	role, err := normalizeWhitelistRole(req.Role)
	if err != nil {
		return dto.WhitelistEntryResponse{}, err
	}

	entry := &models.CEWhitelist{
		Email:    email,
		FullName: fullName,
		Role:     models.WhitelistRole(role),
	}
	if err := s.whitelist.Create(entry); err != nil {
		if errors.Is(err, repository.ErrDuplicate) {
			return dto.WhitelistEntryResponse{}, fmt.Errorf("%w: %s", ErrWhitelistDuplicateEmail, email)
		}
		return dto.WhitelistEntryResponse{}, err
	}

	return whitelistEntryToResponse(*entry), nil
}

func (s *whitelistService) Preview(rows []dto.WhitelistImportRow) (dto.WhitelistImportPreviewResponse, error) {
	emails := make([]string, 0, len(rows))
	for _, row := range rows {
		email := strings.ToLower(strings.TrimSpace(row.Email))
		if email != "" {
			emails = append(emails, email)
		}
	}

	existingRows, err := s.whitelist.FindByEmails(emails)
	if err != nil {
		return dto.WhitelistImportPreviewResponse{}, err
	}
	existingByEmail := make(map[string]models.CEWhitelist, len(existingRows))
	for _, row := range existingRows {
		existingByEmail[strings.ToLower(row.Email)] = row
	}

	previews := make([]dto.WhitelistImportRowPreview, 0, len(rows))
	summary := dto.WhitelistImportSummary{}
	seenAtLine := make(map[string]int)

	for _, row := range rows {
		preview := dto.WhitelistImportRowPreview{
			Line:     row.Line,
			Email:    strings.TrimSpace(row.Email),
			FullName: strings.TrimSpace(row.FullName),
			Role:     strings.TrimSpace(row.Role),
		}

		email, err := normalizeWhitelistEmail(row.Email)
		if err != nil {
			preview.Status = "error"
			preview.Error = err.Error()
			summary.Errors++
			previews = append(previews, preview)
			continue
		}
		preview.Email = email

		if strings.TrimSpace(row.FullName) == "" {
			preview.Status = "error"
			preview.Error = "full_name ห้ามเว้นว่าง"
			summary.Errors++
			previews = append(previews, preview)
			continue
		}

		role, err := normalizeWhitelistRole(row.Role)
		if err != nil {
			preview.Status = "error"
			preview.Error = err.Error()
			summary.Errors++
			previews = append(previews, preview)
			continue
		}
		preview.Role = role

		if firstLine, ok := seenAtLine[email]; ok {
			preview.Status = "duplicate"
			preview.Error = fmt.Sprintf("อีเมลซ้ำกับบรรทัดที่ %d ในไฟล์เดียวกัน", firstLine)
			summary.Duplicates++
			previews = append(previews, preview)
			continue
		}
		seenAtLine[email] = row.Line

		if existing, ok := existingByEmail[email]; ok {
			existingFullName := existing.FullName
			existingRole := string(existing.Role)
			preview.Status = "update"
			preview.ExistingFullName = &existingFullName
			preview.ExistingRole = &existingRole
			summary.Update++
		} else {
			preview.Status = "new"
			summary.New++
		}
		previews = append(previews, preview)
	}

	return dto.WhitelistImportPreviewResponse{Rows: previews, Summary: summary}, nil
}

func (s *whitelistService) Commit(rows []dto.WhitelistImportRow) (dto.WhitelistImportResult, error) {
	result := dto.WhitelistImportResult{}
	if len(rows) == 0 {
		return result, nil
	}

	seenAtLine := make(map[string]int)
	valid := make([]models.CEWhitelist, 0, len(rows))

	for _, row := range rows {
		email, err := normalizeWhitelistEmail(row.Email)
		if err != nil {
			result.Skipped++
			result.Errors = append(result.Errors, fmt.Sprintf("line %d: %v", row.Line, err))
			continue
		}

		fullName := strings.TrimSpace(row.FullName)
		if fullName == "" {
			result.Skipped++
			result.Errors = append(result.Errors, fmt.Sprintf("line %d: full_name ห้ามเว้นว่าง", row.Line))
			continue
		}

		role, err := normalizeWhitelistRole(row.Role)
		if err != nil {
			result.Skipped++
			result.Errors = append(result.Errors, fmt.Sprintf("line %d: %v", row.Line, err))
			continue
		}

		if firstLine, ok := seenAtLine[email]; ok {
			result.Skipped++
			result.Errors = append(result.Errors, fmt.Sprintf("line %d: อีเมลซ้ำกับบรรทัดที่ %d — ข้ามแถวนี้", row.Line, firstLine))
			continue
		}
		seenAtLine[email] = row.Line

		valid = append(valid, models.CEWhitelist{
			Email:    email,
			FullName: fullName,
			Role:     models.WhitelistRole(role),
		})
	}

	if len(valid) == 0 {
		return result, nil
	}

	inserted, updated, err := s.whitelist.UpsertMany(valid)
	if err != nil {
		return result, err
	}
	result.Inserted = inserted
	result.Updated = updated
	return result, nil
}

// normalizeWhitelistRole ตรวจ/แปลง role ที่รับมา — เว้นว่างให้ default เป็น student
func normalizeWhitelistRole(raw string) (string, error) {
	role := strings.ToLower(strings.TrimSpace(raw))
	if role == "" {
		return DefaultWhitelistRole, nil
	}
	if !allowedWhitelistRoles[role] {
		return "", fmt.Errorf("%w: %q (ต้องเป็น student, teacher หรือ admin)", ErrWhitelistInvalidRole, raw)
	}
	return role, nil
}

func normalizeWhitelistEmail(raw string) (string, error) {
	email := strings.ToLower(strings.TrimSpace(raw))
	if email == "" {
		return "", fmt.Errorf("%w: ห้ามเว้นว่าง", ErrWhitelistInvalidEmail)
	}
	if _, err := mail.ParseAddress(email); err != nil {
		return "", fmt.Errorf("%w: %q", ErrWhitelistInvalidEmail, raw)
	}
	return email, nil
}

func whitelistEntryToResponse(row models.CEWhitelist) dto.WhitelistEntryResponse {
	item := dto.WhitelistEntryResponse{
		ID:          row.ID.String(),
		Email:       row.Email,
		StudentCode: row.StudentCode,
		FullName:    row.FullName,
		Role:        string(row.Role),
	}
	if row.StudentCode != nil {
		if label, ok := cecohort.Label(*row.StudentCode); ok {
			item.Cohort = &label
		}
	}
	return item
}
