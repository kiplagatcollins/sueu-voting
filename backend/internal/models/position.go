package models

import "time"

type Position struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null;uniqueIndex:idx_election_position" json:"title"`
	OrderIdx  int       `gorm:"default:0" json:"order_idx"`
	MaxVotes  int       `gorm:"default:1" json:"max_votes"`
	ElectionID uint    `gorm:"not null;uniqueIndex:idx_election_position" json:"election_id"`
	Election  Election  `gorm:"foreignKey:ElectionID" json:"election,omitempty"`
	Candidates []Candidate `gorm:"foreignKey:PositionID" json:"candidates,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
