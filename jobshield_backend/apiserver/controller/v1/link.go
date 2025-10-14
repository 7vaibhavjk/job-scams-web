package v1

import (
	"context"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"anti_scam/apiserver/data"
	v1 "anti_scam/apiserver/v1/repo"
	"anti_scam/pkg/ai"
	"anti_scam/pkg/util/ginutil"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"
)

// Unified response to frontend
type UnifiedResp struct {
	URL        string      `json:"url"`
	BasicCheck interface{} `json:"basicCheck"`
	AICheck    interface{} `json:"aiCheck"`
}

func QueryLinkIsSafe(c *gin.Context) {
	var in v1.QueryLinkSafeReq
	if err := c.ShouldBindBodyWithJSON(&in); err != nil {
		ginutil.WriteResponse(c, err, nil)
		return
	}

	ctx, cancel := context.WithTimeout(c, 65*time.Second)
	defer cancel()

	var (
		basicRes interface{}
		aiRes    *ai.PredictResp
	)

	g, _ := errgroup.WithContext(ctx)

	// Original database query
	g.Go(func() error {
		res, err := data.CheckLinkStatus(in)
		if err != nil {
			return err
		}
		basicRes = res
		return nil
	})

	// New AI model call
	g.Go(func() error {
		if in.Search == "" { // Compatible with your req structure, skip when no url is passed
			return nil
		}
		r, err := ai.Predict(ctx, in.Search)
		if err != nil {
			return nil
		}
		aiRes = r
		return nil
	})

	if err := g.Wait(); err != nil && basicRes == nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}

	// Merge results
	out := UnifiedResp{
		URL:        in.Search,
		BasicCheck: basicRes,
		AICheck:    aiRes,
	}

	ginutil.WriteResponse(c, nil, out)
}

func QueryLinkList(c *gin.Context) {
	var queryLinkReq v1.QueryLinkSafeReq
	if err := c.ShouldBindBodyWithJSON(&queryLinkReq); err != nil {
		ginutil.WriteResponse(c, err, nil)
		return
	}
	allData, err := data.QueryLinkList(queryLinkReq)
	if err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}
	ginutil.WriteResponse(c, nil, allData)
}

func AddDangerLink(c *gin.Context) {
	var addLinkData v1.AddLinkReq
	if err := c.ShouldBindBodyWithJSON(&addLinkData); err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}
	err := data.AddDangerLink(addLinkData)
	if err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}
	ginutil.WriteResponse(c, nil, nil)
}

func GetScamRecords(c *gin.Context) {
	currentDir, err := os.Getwd()
	if err != nil {
		log.Println("Failed to get current directory:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get current directory"})
		return
	}
	// Concatenate JSON file path
	csvPath := filepath.Join(currentDir, "scams_records_normalized_2020_2025.json")
	// Set response headers
	c.Header("Content-Type", "application/json")
	// Return file
	if _, err := os.Stat(csvPath); os.IsNotExist(err) {
		// If file does not exist
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}
	// Use c.File to return JSON file
	c.File(csvPath)
}

// CheckJobAd analyzes job text for scam likelihood
func CheckJobAd(c *gin.Context) {
	type Input struct {
		Text string `json:"text"`
	}
	var in Input
	if err := c.ShouldBindJSON(&in); err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}

	ctx, cancel := context.WithTimeout(c, 60*time.Second)
	defer cancel()

	result, err := ai.AnalyzeJobAd(ctx, in.Text)
	if err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}

	ginutil.WriteResponse(c, nil, result)
}
