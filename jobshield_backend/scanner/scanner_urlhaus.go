package scanner

import (
	"anti_scam/pkg/common"
	db2 "anti_scam/pkg/db"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gorm.io/gorm"
)

type UrlCheck struct {
	Id         uint           `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	Url        string         `json:"url" gorm:"column:url"`
	UrlStatus  string         `json:"url_status" gorm:"column:url_status"`
	Threat     string         `json:"threat" gorm:"column:threat"`
	LastOnline string         `json:"last_online" gorm:"column:last_online"`
	Tags       string         `json:"tags" gorm:"column:tags"`
	Source     string         `json:"source" gorm:"column:source"`
	UrlDetail  string         `json:"url_detail" gorm:"column:url_detail"`
	Reporter   string         `json:"reporter" gorm:"column:reporter"`
	Status     string         `json:"status" gorm:"column:status"`
	CreatedAt  time.Time      `json:"created_at" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"column:updated_at;autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at" gorm:"column:deleted_at;index"`
}

type UrlData struct {
	Url         string   `json:"url"`
	UrlStatus   string   `json:"url_status"`
	LastOnline  string   `json:"last_online"`
	Threat      string   `json:"threat"`
	Tags        []string `json:"tags"`
	UrlhausLink string   `json:"urlhaus_link"`
	Reporter    string   `json:"reporter"`
}

func ProcessHaus() error {
	db := db2.DB
	jsonFiles := []string{
		"a.json",
		"b.json",
		"c.json",
	}
	totalSuccessCount := 0
	for _, filename := range jsonFiles {
		fmt.Printf("Processing file: %s\n", filename)

		urlMap, err := readJSONFile(filename)
		if err != nil {
			log.Printf("Warning: Failed to process file %s: %v", filename, err)
			continue
		}
		successCount, err := batchSaveToDatabase(db, urlMap)
		if err != nil {
			log.Printf("Warning: Failed to save data from %s: %v", filename, err)
			continue
		}

		totalSuccessCount += successCount
		fmt.Printf("File %s processed! Inserted %d records\n", filename, successCount)
	}
	fmt.Printf("All JSON processing completed! Total inserted %d records from %d files\n", totalSuccessCount, len(jsonFiles))
	return nil
}

func readJSONFile(filename string) (map[string][]UrlData, error) {
	currentDir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("failed to get current directory: %v", err)
	}

	jsonPath := filepath.Join(currentDir, filename)

	file, err := os.Open(jsonPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open JSON file: %v", err)
	}
	defer file.Close()

	var urlMap map[string][]UrlData
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&urlMap)
	if err != nil {
		return nil, fmt.Errorf("failed to decode JSON: %v", err)
	}

	return urlMap, nil
}

func batchSaveToDatabase(db *gorm.DB, urlMap map[string][]UrlData) (int, error) {
	var urlChecks []UrlCheck
	var successCount int

	for _, urlDataS := range urlMap {
		for _, urlData := range urlDataS {
			tagsStr := strings.Join(urlData.Tags, ",")

			urlCheck := UrlCheck{
				Url:        urlData.Url,
				UrlStatus:  urlData.UrlStatus,
				Threat:     urlData.Threat,
				LastOnline: urlData.LastOnline,
				Tags:       tagsStr,
				Source:     common.UrlSourceUrlhaus,
				UrlDetail:  urlData.UrlhausLink,
				Reporter:   urlData.Reporter,
				Status:     common.UrlDanger,
			}

			urlChecks = append(urlChecks, urlCheck)
		}
	}

	batchSize := 100
	for i := 0; i < len(urlChecks); i += batchSize {
		end := i + batchSize
		if end > len(urlChecks) {
			end = len(urlChecks)
		}

		batch := urlChecks[i:end]
		result := db.Create(&batch)
		if result.Error != nil {
			log.Printf("Failed to insert batch %d-%d: %v\n", i, end, result.Error)
			continue
		}

		successCount += len(batch)
		fmt.Printf("Inserted batch %d-%d, total: %d\n", i, end, successCount)
	}

	return successCount, nil
}
