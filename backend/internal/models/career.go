package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

////////////////////////////////////////////////////////////
// CAREER CLUSTERS — หัวข้อใหญ่ของควิซแนะนำสาย
////////////////////////////////////////////////////////////

const (
	ClusterSoftware = "software"
	ClusterIoT      = "iot"
	ClusterNetwork  = "network"
	ClusterData     = "data"
)

type CareerCluster struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Code        string    `gorm:"type:varchar(32);not null;uniqueIndex" json:"code"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	NameEn      string    `gorm:"size:255" json:"name_en"`
	Description string    `gorm:"type:text" json:"description"`
	ImageURL    string    `gorm:"type:text" json:"image_url"`
	SortOrder   int       `gorm:"not null;default:0" json:"sort_order"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
}

func (c *CareerCluster) BeforeCreate(tx *gorm.DB) error {
	ensureUUID(&c.ID)
	return nil
}

func (CareerCluster) TableName() string { return "career_clusters" }
