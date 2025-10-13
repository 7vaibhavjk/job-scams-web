package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type JobAnalyzeReq struct {
	Text string `json:"text"`
}

type PhraseInfo struct {
	Importance float64 `json:"importance"`
	Phrase     string  `json:"phrase"`
}

type JobAnalyzeResp struct {
	FakeProbability  float64      `json:"Fake Probability"`
	RealProbability  float64      `json:"Real Probability"`
	Verdict          string       `json:"Verdict"`
	Score            float64      `json:"Score"`
	ImportantPhrases []PhraseInfo `json:"Important Phrases"`
}

// Calls external Job Ad Analyzer API
func AnalyzeJobAd(ctx context.Context, text string) (*JobAnalyzeResp, error) {
	log.Println("🔥 CheckJobAd endpoint triggered!")

	body, _ := json.Marshal(JobAnalyzeReq{Text: text})
	fmt.Println("➡️ Sending to Job Analyzer API with body:", string(body))

	req, _ := http.NewRequestWithContext(ctx, "POST",
		"https://job-ad-analyzer.onrender.com/predict", // ensure /predict path
		bytes.NewBuffer(body),
	)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("❌ Request error:", err)
		return nil, fmt.Errorf("job analyzer request error: %w", err)
	}
	defer resp.Body.Close()

	fmt.Println("✅ API Status Code:", resp.StatusCode)

	var out JobAnalyzeResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		fmt.Println("❌ Decode error:", err)
		return nil, fmt.Errorf("job analyzer decode error: %w", err)
	}

	fmt.Printf("✅ Decoded Response: %+v\n", out)
	return &out, nil
}
