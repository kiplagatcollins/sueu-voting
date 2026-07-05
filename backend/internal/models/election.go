package models

import (
	"time"
)

type Election struct {
	ID          uint        `gorm:"primaryKey" json:"id"`
	Title       string      `gorm:"not null" json:"title"`
	Description string      `json:"description,omitempty"`
	IsActive    bool        `gorm:"default:true" json:"is_active"`
	StartDate   *time.Time  `json:"start_date,omitempty"`
	EndDate     *time.Time  `json:"end_date,omitempty"`
	Positions   []Position  `gorm:"foreignKey:ElectionID" json:"positions,omitempty"`
	Candidates  []Candidate `gorm:"foreignKey:ElectionID" json:"candidates,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}
