package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/egerton-sueu/voting-backend/internal/handlers"
	"github.com/egerton-sueu/voting-backend/internal/models"
	"github.com/egerton-sueu/voting-backend/internal/services"
)

type castVoteRequest struct {
	CandidateID uint `json:"candidate_id"`
	PositionID  uint `json:"position_id"`
}

func CastVote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	voterID, ok := r.Context().Value("voter_id").(uint)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	var req castVoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	if req.CandidateID == 0 || req.PositionID == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "candidate_id and position_id are required"})
		return
	}

	err := services.CastVote(services.CastVoteRequest{
		VoterID:     voterID,
		CandidateID: req.CandidateID,
		PositionID:  req.PositionID,
	})
	if err != nil {
		status := http.StatusInternalServerError
		switch err {
		case services.ErrVoterNotFound, services.ErrCandidateNotFound:
			status = http.StatusNotFound
		case services.ErrAlreadyVoted:
			status = http.StatusConflict
		case services.ErrElectionInactive:
			status = http.StatusForbidden
		case services.ErrPositionMismatch:
			status = http.StatusBadRequest
		}
		writeJSON(w, status, map[string]string{"error": err.Error()})
		return
	}

	handlers.Broadcast("refresh")

	writeJSON(w, http.StatusCreated, map[string]string{"message": "vote cast successfully"})
}

func GetMyVotes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	voterID, ok := r.Context().Value("voter_id").(uint)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	votes, err := services.GetVoterVotes(voterID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to fetch votes"})
		return
	}

	if votes == nil {
		votes = []models.Vote{}
	}

	writeJSON(w, http.StatusOK, votes)
}
