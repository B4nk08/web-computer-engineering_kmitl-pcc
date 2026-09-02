package service

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/dto"
	"github.com/kmitl-pcc/ce-web/backend/internal/pkg/cecohort"
	"github.com/kmitl-pcc/ce-web/backend/internal/repository"
)

type StudentService interface {
	List(opts StudentListInput) ([]dto.StudentResponse, error)
}

type StudentListInput struct {
	// Cohort เช่น CE01 หรือ 01 — แปลงเป็น prefix รหัส
	Cohort string
	// Prefix รหัสโดยตรง เช่น 64
	Prefix string
	Query  string
}

type studentService struct {
	whitelist repository.WhitelistRepository
}

func NewStudentService(whitelist repository.WhitelistRepository) StudentService {
	return &studentService{whitelist: whitelist}
}

func (s *studentService) List(opts StudentListInput) ([]dto.StudentResponse, error) {
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
