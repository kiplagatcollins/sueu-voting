package services

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"time"

	"github.com/egerton-sueu/voting-backend/internal/database"
	"github.com/egerton-sueu/voting-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
)

type LoginResponse struct {
	Voter models.Voter `json:"voter"`
	Token string       `json:"token"`
}

type VotingSession struct {
	VoterID   uint
	IsAdmin   bool
	ExpiresAt time.Time
}

func Authenticate(email, password string) (*LoginResponse, error) {
	var voter models.Voter
	if err := database.DB.Where("email = ?", email).First(&voter).Error; err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(voter.Password), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	token := generateSessionToken(voter.ID, voter.IsAdmin)

	return &LoginResponse{
		Voter: voter,
		Token: token,
	}, nil
}

func ValidateSession(token string) (*VotingSession, error) {
	session, err := decodeSessionToken(token)
	if err != nil {
		return nil, errors.New("invalid session")
	}
	if time.Now().After(session.ExpiresAt) {
		return nil, errors.New("session expired")
	}
	return session, nil
}

func GetVoterByID(id uint) (*models.Voter, error) {
	var voter models.Voter
	if err := database.DB.First(&voter, id).Error; err != nil {
		return nil, errors.New("voter not found")
	}
	return &voter, nil
}

type sessionPayload struct {
	VoterID uint  `json:"voter_id"`
	IsAdmin bool  `json:"is_admin"`
	Exp     int64 `json:"exp"`
}

func generateSessionToken(voterID uint, isAdmin bool) string {
	payload := sessionPayload{
		VoterID: voterID,
		IsAdmin: isAdmin,
		Exp:     time.Now().Add(24 * time.Hour).Unix(),
	}
	data, _ := json.Marshal(payload)
	return base64.StdEncoding.EncodeToString(data)
}

func decodeSessionToken(token string) (*VotingSession, error) {
	data, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return nil, err
	}
	var payload sessionPayload
	if err := json.Unmarshal(data, &payload); err != nil {
		return nil, err
	}
	return &VotingSession{
		VoterID:   payload.VoterID,
		IsAdmin:   payload.IsAdmin,
		ExpiresAt: time.Unix(payload.Exp, 0),
	}, nil
}
