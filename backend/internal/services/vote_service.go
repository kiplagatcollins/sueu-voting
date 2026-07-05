package services

import (
	"errors"

	"github.com/egerton-sueu/voting-backend/internal/database"
	"github.com/egerton-sueu/voting-backend/internal/models"
	"gorm.io/gorm"
)

var (
	ErrVoterNotFound   = errors.New("voter not found")
	ErrAlreadyVoted    = errors.New("voter has already cast a vote for this position")
	ErrCandidateNotFound = errors.New("candidate not found")
	ErrElectionInactive  = errors.New("election is not active")
	ErrPositionMismatch  = errors.New("candidate does not belong to the specified position")
)

type CastVoteRequest struct {
	VoterID     uint `json:"voter_id"`
	CandidateID uint `json:"candidate_id"`
	PositionID  uint `json:"position_id"`
}

func CastVote(req CastVoteRequest) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var voter models.Voter
		if err := tx.First(&voter, req.VoterID).Error; err != nil {
			return ErrVoterNotFound
		}

		if voter.HasVoted {
			return ErrAlreadyVoted
		}

		var candidate models.Candidate
		if err := tx.First(&candidate, req.CandidateID).Error; err != nil {
			return ErrCandidateNotFound
		}

		if candidate.PositionID != req.PositionID {
			return ErrPositionMismatch
		}

		var election models.Election
		if err := tx.First(&election, candidate.ElectionID).Error; err != nil {
			return ErrElectionInactive
		}
		if !election.IsActive {
			return ErrElectionInactive
		}

		var existingVote int64
		tx.Model(&models.Vote{}).
			Where("voter_id = ? AND position_id = ?", req.VoterID, req.PositionID).
			Count(&existingVote)
		if existingVote > 0 {
			return ErrAlreadyVoted
		}

		vote := models.Vote{
			VoterID:     req.VoterID,
			CandidateID: req.CandidateID,
			PositionID:  req.PositionID,
			ElectionID:  candidate.ElectionID,
		}
		if err := tx.Create(&vote).Error; err != nil {
			return err
		}

		var pos models.Position
		tx.First(&pos, req.PositionID)

		var totalVoted int64
		tx.Model(&models.Vote{}).
			Where("voter_id = ?", req.VoterID).
			Group("position_id").
			Count(&totalVoted)

		var totalPositions int64
		tx.Model(&models.Position{}).
			Where("election_id = ?", election.ID).
			Count(&totalPositions)

		if totalVoted >= totalPositions {
			tx.Model(&voter).Update("has_voted", true)
		}

		return nil
	})
}

func GetVoterVotes(voterID uint) ([]models.Vote, error) {
	var votes []models.Vote
	err := database.DB.Where("voter_id = ?", voterID).
		Preload("Candidate").
		Preload("Position").
		Find(&votes).Error
	return votes, err
}

func GetElectionWithCandidates() (*models.Election, error) {
	var election models.Election
	err := database.DB.Where("is_active = ?", true).
		Preload("Positions", func(db *gorm.DB) *gorm.DB {
			return db.Order("order_idx ASC")
		}).
		Preload("Positions.Candidates").
		First(&election).Error
	if err != nil {
		return nil, err
	}
	return &election, nil
}
