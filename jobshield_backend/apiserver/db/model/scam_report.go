package model

type ScamReport struct {
	Id                   uint    `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	Date                 string  `json:"date" gorm:"type:datetime"`
	State                string  `json:"state" gorm:"type:varchar(100)"`
	ContactMethod        string  `json:"contact_method" gorm:"type:varchar(100)"`
	AgeGroup             string  `json:"age_group" gorm:"type:varchar(50)"`
	Gender               string  `json:"gender" gorm:"type:varchar(50)"`
	ScamCategory         string  `json:"scam_category" gorm:"type:varchar(100)"`
	ScamType             string  `json:"scam_type" gorm:"type:varchar(100)"`
	AggregatedAmountLost float64 `json:"aggregated_amount_lost"`
	NumberOfReports      int     `json:"number_of_reports"`
}
