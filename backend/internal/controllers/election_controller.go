package controllers

import (
	"net/http"

	"github.com/egerton-sueu/voting-backend/internal/services"
)

func GetActiveElection(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	election, err := services.GetElectionWithCandidates()
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "no active election found"})
		return
	}

	writeJSON(w, http.StatusOK, election)
}
