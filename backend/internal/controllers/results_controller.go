package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/egerton-sueu/voting-backend/internal/handlers"
	"github.com/egerton-sueu/voting-backend/internal/services"
)

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func GetResults(w http.ResponseWriter, r *http.Request) {
	results, err := services.GetResults()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to fetch results"})
		return
	}

	writeJSON(w, http.StatusOK, results)
}

func SeedDemoData(w http.ResponseWriter, r *http.Request) {
	if err := services.SeedDemo(); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to seed data"})
		return
	}

	handlers.Broadcast("refresh")

	writeJSON(w, http.StatusCreated, map[string]string{"message": "demo data seeded successfully"})
}

func ResetVotes(w http.ResponseWriter, r *http.Request) {
	if err := services.ResetAllVotes(); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to reset votes"})
		return
	}

	handlers.Broadcast("refresh")

	writeJSON(w, http.StatusOK, map[string]string{"message": "all votes reset successfully"})
}
