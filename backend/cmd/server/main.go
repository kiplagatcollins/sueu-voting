package main

import (
	"log"
	"net/http"
	"os"

	"github.com/egerton-sueu/voting-backend/internal/controllers"
	"github.com/egerton-sueu/voting-backend/internal/database"
	"github.com/egerton-sueu/voting-backend/internal/handlers"
	"github.com/egerton-sueu/voting-backend/internal/middleware"
	"github.com/egerton-sueu/voting-backend/internal/services"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	database.Connect()
	database.Migrate()
	if err := services.SeedDemo(); err != nil {
		log.Printf("warning: failed to seed demo data: %v", err)
	}

	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("GET /api/v1/events", handlers.SSEHandler)
	mux.HandleFunc("GET /api/v1/results", controllers.GetResults)
	mux.HandleFunc("GET /api/v1/elections/active", controllers.GetActiveElection)
	mux.HandleFunc("POST /api/v1/auth/login", controllers.Login)
	mux.HandleFunc("POST /api/v1/seed", controllers.SeedDemoData)

	// Authenticated routes
	authMux := http.NewServeMux()
	authMux.HandleFunc("POST /api/v1/vote", controllers.CastVote)
	authMux.HandleFunc("GET /api/v1/votes/mine", controllers.GetMyVotes)
	authMux.HandleFunc("GET /api/v1/auth/profile", controllers.GetProfile)

	// Admin routes
	adminMux := http.NewServeMux()
	adminMux.HandleFunc("POST /api/v1/admin/reset", controllers.ResetVotes)
	adminMux.HandleFunc("POST /api/v1/admin/seed", controllers.SeedDemoData)

	mux.Handle("/api/v1/vote", middleware.RequireAuth(authMux))
	mux.Handle("/api/v1/votes/", middleware.RequireAuth(authMux))
	mux.Handle("/api/v1/auth/profile", middleware.RequireAuth(authMux))
	mux.Handle("/api/v1/admin/", middleware.RequireAuth(middleware.RequireAdmin(adminMux)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("server starting on :%s", port)
	if err := http.ListenAndServe(":"+port, corsMiddleware(mux)); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
