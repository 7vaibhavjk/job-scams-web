package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// 请求体
type PredictReq struct {
	URL string `json:"url"`
}

// 响应体（和你的 Python 模型返回结构对应）
type PredictResp struct {
	URL            string             `json:"url"`
	Prediction     string             `json:"prediction"`
	IsPhishing     bool               `json:"is_phishing"`
	Confidence     float64            `json:"confidence"`
	SafetyScore    int                `json:"safety_score"`
	RiskLevel      string             `json:"risk_level"`
	Probabilities  map[string]float64 `json:"probabilities"`
	SummaryReasons []string           `json:"summary_reasons"`
}

// 调用 Render 上的模型
func Predict(ctx context.Context, url string) (*PredictResp, error) {
	body, _ := json.Marshal(PredictReq{URL: url})
	req, _ := http.NewRequestWithContext(ctx, "POST",
		"https://url-checker-api-2.onrender.com/predict",
		bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ai request error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("ai bad status: %s", resp.Status)
	}

	var out PredictResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, fmt.Errorf("ai decode error: %w", err)
	}
	return &out, nil
}
