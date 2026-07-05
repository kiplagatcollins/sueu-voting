package models

import "time"

type Candidate struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `gorm:"not null" json:"name"`
	Bio        string    `json:"bio,omitempty"`
	AvatarURL  string    `json:"avatar_url,omitempty"`
	PositionID uint      `gorm:"not null;index" json:"position_id"`
	Position   Position  `gorm:"foreignKey:PositionID" json:"position,omitempty"`
	ElectionID uint      `gorm:"not null;index" json:"election_id"`
	Election   Election  `gorm:"foreignKey:ElectionID" json:"election,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
