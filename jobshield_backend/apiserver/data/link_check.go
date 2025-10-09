package data

import (
	"anti_scam/apiserver/db/model"
	"anti_scam/apiserver/v1/repo"
	"anti_scam/pkg/common"
	db2 "anti_scam/pkg/db"
	"fmt"
)

func CheckLinkStatus(req repo.QueryLinkSafeReq) (repo.QueryLinkCheckResp, error) {
	var respData repo.QueryLinkCheckResp
	db := db2.DB
	dataQuery := db.Model(&model.UrlCheck{})
	if req.Search != "" {
		dataQuery = dataQuery.Where("url LIKE ?", "%"+req.Search+"%")
	}
	err := dataQuery.Count(&respData.TotalCount).Error
	if err != nil {
		return respData, err
	}
	if err = dataQuery.Order("created_at").Find(&respData.LinkDataList).Error; err != nil {
		return respData, err
	}
	return respData, nil
}

func QueryLinkList(req repo.QueryLinkSafeReq) (repo.QueryLinkCheckResp, error) {
	var respData repo.QueryLinkCheckResp
	db := db2.DB
	dataQuery := db.Model(&model.UrlCheck{})
	if req.Status != "" {
		dataQuery = dataQuery.Where("status = ?", req.Status)
	}
	if req.Threat != "" {
		dataQuery = dataQuery.Where("threat = ?", req.Threat)
	}
	if req.Source != "" {
		dataQuery = dataQuery.Where("source = ?", req.Source)
	}
	err := dataQuery.Count(&respData.TotalCount).Error
	if err != nil {
		return respData, err
	}
	if err = dataQuery.Order("created_at").Find(&respData.LinkDataList).Error; err != nil {
		return respData, err
	}
	return respData, nil
}

func AddDangerLink(req repo.AddLinkReq) error {
	db := db2.DB
	err := db.Model(&model.UrlCheck{}).Create(&model.UrlCheck{
		Url:      req.Url,
		Status:   common.UrlDanger,
		Threat:   req.Threat,
		Reporter: common.ReporterWebUser,
	}).Error
	if err != nil {
		fmt.Printf("create the danger url fail %v\n", err)
		return err
	}
	return nil
}

func GetScamRecords() ([]model.ScamRecord, error) {
	var records []model.ScamRecord
	db := db2.DB
	err := db.Find(&records).Error
	if err != nil {
		fmt.Printf("get the scam records fail %v\n", err)
		return nil, err
	}
	return records, nil
}
