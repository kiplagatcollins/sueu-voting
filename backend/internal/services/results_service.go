package services

import (
	"github.com/egerton-sueu/voting-backend/internal/database"
	"github.com/egerton-sueu/voting-backend/internal/models"
	"gorm.io/gorm"
)

type CandidateResult struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Bio    string `json:"bio,omitempty"`
	Votes  int64  `json:"votes"`
	Rank   int    `json:"rank"`
	Avatar string `json:"avatar,omitempty"`
}

type PositionResult struct {
	PositionID uint              `json:"position_id"`
	Position   string            `json:"position"`
	MaxVotes   int               `json:"max_votes"`
	Candidates []CandidateResult `json:"candidates"`
}

type ResultsSummary struct {
	ElectionID      uint             `json:"election_id"`
	ElectionTitle   string           `json:"election_title"`
	Positions       []PositionResult `json:"positions"`
	TotalVoters     int64            `json:"total_voters"`
	TotalVotesCast  int64            `json:"total_votes_cast"`
	VoterTurnoutPct float64          `json:"voter_turnout_pct"`
}

func GetResults() (*ResultsSummary, error) {
	var election models.Election
	if err := database.DB.Where("is_active = ?", true).
		Preload("Positions", func(db *gorm.DB) *gorm.DB {
			return db.Order("order_idx ASC")
		}).
		First(&election).Error; err != nil {
		return nil, err
	}

	var totalVoters int64
	database.DB.Model(&models.Voter{}).Count(&totalVoters)

	var totalVotesCast int64
	database.DB.Model(&models.Vote{}).Where("election_id = ?", election.ID).Count(&totalVotesCast)

	var turnoutPct float64
	if totalVoters > 0 {
		turnoutPct = float64(totalVotesCast) / float64(totalVoters) * 100
	}

	positions := make([]PositionResult, 0, len(election.Positions))
	for _, pos := range election.Positions {
		var candidates []models.Candidate
		database.DB.Where("position_id = ? AND election_id = ?", pos.ID, election.ID).
			Find(&candidates)

		type voteCount struct {
			CandidateID uint
			Count       int64
		}
		var counts []voteCount
		database.DB.Model(&models.Vote{}).
			Select("candidate_id, count(*) as count").
			Where("position_id = ? AND election_id = ?", pos.ID, election.ID).
			Group("candidate_id").
			Scan(&counts)

		voteMap := make(map[uint]int64)
		for _, c := range counts {
			voteMap[c.CandidateID] = c.Count
		}

		candResults := make([]CandidateResult, 0, len(candidates))
		for _, c := range candidates {
			v := voteMap[c.ID]
			candResults = append(candResults, CandidateResult{
				ID:     c.ID,
				Name:   c.Name,
				Bio:    c.Bio,
				Votes:  v,
				Avatar: c.AvatarURL,
			})
		}

		for i := 0; i < len(candResults); i++ {
			for j := i + 1; j < len(candResults); j++ {
				if candResults[j].Votes > candResults[i].Votes {
					candResults[i], candResults[j] = candResults[j], candResults[i]
				}
			}
		}

		for i := range candResults {
			candResults[i].Rank = i + 1
		}

		positions = append(positions, PositionResult{
			PositionID: pos.ID,
			Position:   pos.Title,
			MaxVotes:   pos.MaxVotes,
			Candidates: candResults,
		})
	}

	return &ResultsSummary{
		ElectionID:      election.ID,
		ElectionTitle:   election.Title,
		Positions:       positions,
		TotalVoters:     totalVoters,
		TotalVotesCast:  totalVotesCast,
		VoterTurnoutPct: turnoutPct,
	}, nil
}
