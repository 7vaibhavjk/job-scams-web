package scanner

import (
	"anti_scam/apiserver/db/model"
	"strconv"

	"github.com/xuri/excelize/v2"
)

func ParseExcelFile(filePath string) ([]model.ScamReport, error) {
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	rows, err := f.GetRows("Scamwatch901 Public Scams Dashb")
	if err != nil {
		return nil, err
	}

	var reports []model.ScamReport

	// 跳过标题行
	for i, row := range rows {
		if i == 0 {
			continue
		}

		if len(row) < 9 {
			continue
		}

		// 解析金额
		amount, err := strconv.ParseFloat(row[7], 64)
		if err != nil {
			amount = 0
		}

		// 解析报告数量
		reportsCount, err := strconv.Atoi(row[8])
		if err != nil {
			reportsCount = 0
		}

		report := model.ScamReport{
			Date:                 row[0],
			State:                row[1],
			ContactMethod:        row[2],
			AgeGroup:             row[3],
			Gender:               row[4],
			ScamCategory:         row[5],
			ScamType:             row[6],
			AggregatedAmountLost: amount,
			NumberOfReports:      reportsCount,
		}

		reports = append(reports, report)
	}

	return reports, nil
}
