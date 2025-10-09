package scanner

import (
	"anti_scam/apiserver/db/model"
	db2 "anti_scam/pkg/db"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func ScamRecordHandler() error {
	var count int64
	db := db2.DB
	err := db.Model(&model.ScamRecord{}).Count(&count).Error
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	currentDir, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	csvPath := filepath.Join(currentDir, "scams_records_normalized_2020_2025.json")
	file, err := os.ReadFile(csvPath)
	if err != nil {
		return fmt.Errorf("failed to open scams_records_normalized_2020_2025.json file: %v", err)
	}

	var records []model.ScamRecord
	if err := json.Unmarshal(file, &records); err != nil {
		return fmt.Errorf("failed to parse JSON data: %v", err)
	}

	result := db.CreateInBatches(records, 100)
	if result.Error != nil {
		return fmt.Errorf("failed to insert data into database: %v", err)
	}

	fmt.Println("scams_records_normalized_2020_2025.json processing completed!")
	return nil
}
