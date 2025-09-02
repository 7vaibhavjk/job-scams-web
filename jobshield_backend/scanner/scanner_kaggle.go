package scanner

import (
	"anti_scam/apiserver/db/model"
	"anti_scam/pkg/common"
	db2 "anti_scam/pkg/db"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func ProcessCSV() error {
	db := db2.DB
	currentDir, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	csvPath := filepath.Join(currentDir, "dataset_phishing.csv")
	file, err := os.Open(csvPath)
	if err != nil {
		return fmt.Errorf("failed to open csv file: %v", err)
	}
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		return fmt.Errorf("failed to read CSV header: %v", err)
	}

	for {
		record, err := reader.Read()
		if err != nil {
			break
		}

		url := record[0]
		status := record[len(record)-1]

		var dbStatus string
		if status == "phishing" {
			dbStatus = common.UrlDanger
		} else if status == "legitimate" {
			dbStatus = common.UrlSafety
		} else {
			dbStatus = common.UrlUnknown
		}

		urlCheck := model.UrlCheck{
			Url:    url,
			Status: dbStatus,
			Source: common.UrlSourceKaggle,
		}

		err = db.Create(&urlCheck).Error
		if err != nil {
			log.Printf("Failed to insert record for URL: %s, Status: %s\n", url, status)
		}
	}

	fmt.Println("CSV processing completed!")
	return nil
}
