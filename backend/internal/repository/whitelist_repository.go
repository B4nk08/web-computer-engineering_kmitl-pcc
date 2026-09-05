package repository

import (
	"strings"

	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type WhitelistRepository interface {
	// FindByEmail หา entry ใน ce_whitelist ตามอีเมล (คืน ErrNotFound ถ้าไม่มี)
	FindByEmail(email string) (*models.CEWhitelist, error)
	// FindByEmails หา entry หลายอีเมลพร้อมกัน (ใช้ตอน preview import)
	FindByEmails(emails []string) ([]models.CEWhitelist, error)
	// ListByRole รายการตาม role (เช่น student, teacher) เรียงชื่อ
	ListByRole(role models.WhitelistRole) ([]models.CEWhitelist, error)
	// ListStudents รายการนักศึกษา พร้อม filter optional
	ListStudents(opts StudentListOpts) ([]models.CEWhitelist, error)
	// Create เพิ่มรายชื่อทีละคน
	Create(entry *models.CEWhitelist) error
	// UpsertMany insert-or-update ตาม email (ใช้ตอน commit import CSV)
	// คืนจำนวนแถวที่ insert ใหม่ / update
	UpsertMany(rows []models.CEWhitelist) (inserted, updated int, err error)
}

type StudentListOpts struct {
	// StudentCodePrefix เช่น "64" จากรุ่น CE01
	StudentCodePrefix string
	// Query ค้นใน email / full_name / student_code
	Query string
}

type whitelistRepository struct {
	db *gorm.DB
}

func NewWhitelistRepository(db *gorm.DB) WhitelistRepository {
	return &whitelistRepository{db: db}
}

func (r *whitelistRepository) FindByEmail(email string) (*models.CEWhitelist, error) {
	var entry models.CEWhitelist
	if err := r.db.Where("email = ?", email).First(&entry).Error; err != nil {
		return nil, translate(err)
	}
	return &entry, nil
}

func (r *whitelistRepository) FindByEmails(emails []string) ([]models.CEWhitelist, error) {
	if len(emails) == 0 {
		return nil, nil
	}
	var rows []models.CEWhitelist
	err := r.db.Where("email IN ?", emails).Find(&rows).Error
	return rows, err
}

func (r *whitelistRepository) ListByRole(role models.WhitelistRole) ([]models.CEWhitelist, error) {
	var rows []models.CEWhitelist
	err := r.db.Where("role = ?", role).Order("full_name ASC, email ASC").Find(&rows).Error
	return rows, err
}

func (r *whitelistRepository) ListStudents(opts StudentListOpts) ([]models.CEWhitelist, error) {
	q := r.db.Where("role = ?", models.WhitelistStudent)

	prefix := strings.TrimSpace(opts.StudentCodePrefix)
	if prefix != "" {
		q = q.Where("student_code LIKE ?", prefix+"%")
	}

	search := strings.TrimSpace(opts.Query)
	if search != "" {
		like := "%" + search + "%"
		q = q.Where(
			"(email ILIKE ? OR full_name ILIKE ? OR COALESCE(student_code, '') ILIKE ?)",
			like, like, like,
		)
	}

	var rows []models.CEWhitelist
	err := q.Order("student_code ASC NULLS LAST, full_name ASC, email ASC").Find(&rows).Error
	return rows, err
}

func (r *whitelistRepository) Create(entry *models.CEWhitelist) error {
	if err := r.db.Create(entry).Error; err != nil {
		return translate(err)
	}
	return nil
}

// UpsertMany insert-or-update ตาม email (unique) — ใช้ตอน commit import CSV
// คืนจำนวนแถวที่เป็นการ insert ใหม่ กับจำนวนแถวที่เป็นการ update ของเดิม
func (r *whitelistRepository) UpsertMany(rows []models.CEWhitelist) (inserted, updated int, err error) {
	if len(rows) == 0 {
		return 0, 0, nil
	}

	emails := make([]string, 0, len(rows))
	for _, row := range rows {
		emails = append(emails, row.Email)
	}

	var existingEmails []string
	if err := r.db.Model(&models.CEWhitelist{}).
		Where("email IN ?", emails).
		Pluck("email", &existingEmails).Error; err != nil {
		return 0, 0, err
	}
	existing := make(map[string]struct{}, len(existingEmails))
	for _, email := range existingEmails {
		existing[email] = struct{}{}
	}

	if err := r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "email"}},
		DoUpdates: clause.AssignmentColumns([]string{"full_name", "role", "updated_at"}),
	}).Create(&rows).Error; err != nil {
		return 0, 0, err
	}

	for _, row := range rows {
		if _, ok := existing[row.Email]; ok {
			updated++
		} else {
			inserted++
		}
	}
	return inserted, updated, nil
}
