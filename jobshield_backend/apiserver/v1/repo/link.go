package repo

import (
	"time"

	"gorm.io/gorm"
)

type AddLinkReq struct {
	Url    string `json:"url"`
	Threat string `json:"threat"`
}

type ServerList struct {
	ServerName     string `json:"serverName"`
	LastTime       string `json:"lastTime"`
	ReTimeInterval string `json:"reTimeInterval"`
}

type QueryLinkSafeReq struct {
	Search string `json:"search"`
	Threat string `json:"threat" gorm:"column:threat"`
	Source string `json:"source" gorm:"column:source"`
	Status string `json:"status" gorm:"column:status"`
}

type QueryLinkCheckResp struct {
	LinkDataList []LinkCheckData `json:"linkDataList"`
	TotalCount   int64           `json:"totalCount"`
}

type LinkCheckData struct {
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
