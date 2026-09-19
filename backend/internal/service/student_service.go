package service

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/cecohort"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

var (
	ErrNotCEMember        = errors.New("not in ce_whitelist")
	ErrMissingStudentCode = errors.New("student_code required")
	ErrInvalidStudentCode = errors.New("invalid student_code")
)

type StudentService interface {
	// ListForViewer รายชื่อตามสิทธิ์ผู้เรียก
	// นักศึกษา: เฉพาะรุ่นเดียวกับตนเอง (จากรหัส เช่น 6620001 → 66)
	// อาจารย์/แอดมิน: กรองตาม query ได้
	ListForViewer(opts StudentViewerInput) ([]dto.StudentResponse, error)
}

type StudentViewerInput struct {
	Email  string
	Role   string
	Cohort string
	Prefix string
	Query  string
}

type studentService struct {
	whitelist repository.WhitelistRepository
}

func NewStudentService(whitelist repository.WhitelistRepository) StudentService {
	return &studentService{whitelist: whitelist}
}

func (s *studentService) ListForViewer(opts StudentViewerInput) ([]dto.StudentResponse, error) {
	email := strings.ToLower(strings.TrimSpace(opts.Email))
	entry, err := s.whitelist.FindByEmail(email)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}

	role := strings.ToLower(strings.TrimSpace(opts.Role))
	if entry != nil {
		role = string(entry.Role)
	}

	if isStaffRole(role) {
		items, listErr := s.list(studentListOpts{
			Prefix: strings.TrimSpace(opts.Prefix),
			Cohort: opts.Cohort,
			Query:  opts.Query,
		})
		if listErr != nil {
			return nil, listErr
		}
		return markSelf(items, email, true), nil
	}

	if entry == nil || entry.Role != models.WhitelistStudent {
		return nil, ErrNotCEMember
	}
	if entry.StudentCode == nil || strings.TrimSpace(*entry.StudentCode) == "" {
		return nil, ErrMissingStudentCode
	}

	prefix, ok := cecohort.PrefixDigits(*entry.StudentCode)
	if !ok {
		return nil, ErrInvalidStudentCode
	}

	items, err := s.list(studentListOpts{Prefix: prefix, Query: opts.Query})
	if err != nil {
		return nil, err
	}
	return markSelf(items, email, false), nil
}

type studentListOpts struct {
	Prefix string
	Cohort string
	Query  string
}

func (s *studentService) list(opts studentListOpts) ([]dto.StudentResponse, error) {
	prefix := strings.TrimSpace(opts.Prefix)
	if prefix == "" {
		prefix = prefixFromCohortQuery(opts.Cohort)
	}

	rows, err := s.whitelist.ListStudents(repository.StudentListOpts{
		StudentCodePrefix: prefix,
		Query:             opts.Query,
	})
	if err != nil {
		return nil, err
	}

	out := make([]dto.StudentResponse, 0, len(rows))
	for _, row := range rows {
		item := dto.StudentResponse{
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
		out = append(out, item)
	}
	return out, nil
}

func markSelf(items []dto.StudentResponse, email string, keepPrivateFields bool) []dto.StudentResponse {
	for i := range items {
		items[i].IsSelf = email != "" && strings.EqualFold(items[i].Email, email)
		if !keepPrivateFields {
			items[i].Email = ""
			items[i].StudentCode = nil
		}
	}
	return items
}

func isStaffRole(role string) bool {
	return role == string(models.WhitelistTeacher) ||
		role == string(models.WhitelistAdmin) ||
		role == string(models.RoleTeacher) ||
		role == string(models.RoleAdmin)
}

// prefixFromCohortQuery รับ "CE01" / "ce01" / "01" → "64"
func prefixFromCohortQuery(cohort string) string {
	cohort = strings.TrimSpace(strings.ToUpper(cohort))
	if cohort == "" {
		return ""
	}
	cohort = strings.TrimPrefix(cohort, "CE")
	n, err := strconv.Atoi(cohort)
	if err != nil || n < 1 {
		return ""
	}
	prefix := cecohort.FirstCohortPrefix + n - cecohort.FirstCohortNumber
	if prefix < 10 || prefix > 99 {
		return ""
	}
	return fmt.Sprintf("%02d", prefix)
}
