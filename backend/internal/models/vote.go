package models

import "time"

type Vote struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	VoterID     uint      `gorm:"not null;uniqueIndex:idx_voter_position" json:"voter_id"`
	CandidateID uint      `gorm:"not null" json:"candidate_id"`
	PositionID  uint      `gorm:"not null;uniqueIndex:idx_voter_position" json:"position_id"`
	ElectionID  uint      `gorm:"not null;index" json:"election_id"`
	Voter       Voter     `gorm:"foreignKey:VoterID" json:"voter,omitempty"`
	Candidate   Candidate `gorm:"foreignKey:CandidateID" json:"candidate,omitempty"`
	Position    Position  `gorm:"foreignKey:PositionID" json:"position,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}
