package services

import (
	"log"

	"github.com/egerton-sueu/voting-backend/internal/database"
	"github.com/egerton-sueu/voting-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedDemo() error {
	var count int64
	database.DB.Model(&models.Election{}).Count(&count)
	if count > 0 {
		return nil
	}

	return database.DB.Transaction(func(tx *gorm.DB) error {
		election := models.Election{
			Title:       "2026 SUEU General Elections",
			Description: "Student Union Elections for the 2026/2027 academic year",
			IsActive:    true,
		}
		if err := tx.Create(&election).Error; err != nil {
			return err
		}

		positions := []models.Position{
			{Title: "Chairman", OrderIdx: 1, MaxVotes: 1, ElectionID: election.ID},
			{Title: "Vice Chairman", OrderIdx: 2, MaxVotes: 1, ElectionID: election.ID},
			{Title: "Secretary", OrderIdx: 3, MaxVotes: 1, ElectionID: election.ID},
			{Title: "Treasurer", OrderIdx: 4, MaxVotes: 1, ElectionID: election.ID},
		}
		for i := range positions {
			if err := tx.Create(&positions[i]).Error; err != nil {
				return err
			}
		}

		candidatesByPosition := map[string][]struct {
			Name string
			Bio  string
		}{
			"Chairman": {
				{"Collins", "Experienced student leader, 3rd year Computer Science"},
				{"Rono", "Advocating for digital transformation, 4th year Engineering"},
				{"Omondi", "Passionate about student welfare, 3rd year Law"},
				{"Brian", "Focus on academic excellence, 2nd year Business"},
			},
			"Vice Chairman": {
				{"Evans", "Former class representative, 3rd year Economics"},
				{"Mavin", "Student council veteran, 4th year Political Science"},
			},
			"Secretary": {
				{"Alice", "Detail-oriented organizer, 2nd year Journalism"},
				{"Peter", "Tech-savvy administrator, 3rd year IT"},
			},
			"Treasurer": {
				{"Jane", "Financial management expert, 4th year Accounting"},
				{"Mike", "Budget committee member, 3rd year Finance"},
			},
		}

		for posTitle, cands := range candidatesByPosition {
			var pos models.Position
			if err := tx.Where("title = ? AND election_id = ?", posTitle, election.ID).First(&pos).Error; err != nil {
				return err
			}
			for _, c := range cands {
				candidate := models.Candidate{
					Name:       c.Name,
					Bio:        c.Bio,
					AvatarURL:  "",
					PositionID: pos.ID,
					ElectionID: election.ID,
				}
				if err := tx.Create(&candidate).Error; err != nil {
					return err
				}
			}
		}

		voters := []struct {
			Name      string
			Email     string
			StudentID string
			Password  string
			IsAdmin   bool
		}{
			{"Admin User", "admin@sueu.edu", "ADM001", "admin123", true},
			{"John Doe", "john@sueu.edu", "STU001", "pass123", false},
			{"Jane Smith", "jane@sueu.edu", "STU002", "pass123", false},
			{"Bob Johnson", "bob@sueu.edu", "STU003", "pass123", false},
			{"Alice Brown", "alice@sueu.edu", "STU004", "pass123", false},
		}
		for _, v := range voters {
			hash, err := bcrypt.GenerateFromPassword([]byte(v.Password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			voter := models.Voter{
				Name:      v.Name,
				Email:     v.Email,
				StudentID: v.StudentID,
				Password:  string(hash),
				IsAdmin:   v.IsAdmin,
				HasVoted:  false,
			}
			if err := tx.Create(&voter).Error; err != nil {
				return err
			}
		}

		log.Println("demo data seeded successfully")
		return nil
	})
}

func ResetAllVotes() error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec("DELETE FROM votes").Error; err != nil {
			return err
		}
		if err := tx.Model(&models.Voter{}).Where("is_admin = ?", false).Update("has_voted", false).Error; err != nil {
			return err
		}
		log.Println("all votes reset successfully")
		return nil
	})
}
