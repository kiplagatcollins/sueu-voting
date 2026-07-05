package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/egerton-sueu/voting-backend/internal/services"
)

type contextKey string

const (
	VoterIDKey contextKey = "voter_id"
	IsAdminKey contextKey = "is_admin"
)

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error":"authorization header required"}`, http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			http.Error(w, `{"error":"bearer token required"}`, http.StatusUnauthorized)
			return
		}

		session, err := services.ValidateSession(token)
		if err != nil {
			http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), VoterIDKey, session.VoterID)
		ctx = context.WithValue(ctx, IsAdminKey, session.IsAdmin)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		isAdmin, ok := r.Context().Value(IsAdminKey).(bool)
		if !ok || !isAdmin {
			http.Error(w, `{"error":"admin access required"}`, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}
