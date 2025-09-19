package db

import (
	"anti_scam/apiserver/db/model"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	var err error
	// SQLite database file path, default to 'app.db' in the current directory
	dsn := "./anti_scam.db"

	// Set up logging
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // Log output
		logger.Config{
			SlowThreshold: 0,
			LogLevel:      logger.Error,
			Colorful:      false,
		},
	)

	// Use SQLite connection
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		fmt.Println("Failed to connect to the database:", err)
		panic("Failed to connect to the database")
	}
	// Auto migrate models
	err = DB.AutoMigrate(&model.UrlCheck{}, &model.ScamRecord{})
	if err != nil {
		fmt.Println("Failed to auto-migrate:", err)
		panic("Failed to auto-migrate")
	}
	fmt.Println("Successfully connected to the database")
}
