package model

type ScamRecord struct {
	ID            uint    `gorm:"primaryKey" json:"-"`
	Date          string  `json:"date"`
	StateName     string  `json:"state_name"`
	ContactMethod string  `json:"contact_method"`
	AgeBand       string  `json:"age_band"`
	Gender        string  `json:"gender"`
	ScamGroup     string  `json:"scam_group"`
	ScamType      string  `json:"scam_type"`
	AmountLostAud float64 `json:"amount_lost_aud"`
	ReportCount   int     `json:"report_count"`
	StateCode     string  `json:"state_code"`
	Year          int     `json:"year"`
	Month         string  `json:"month"`
}
