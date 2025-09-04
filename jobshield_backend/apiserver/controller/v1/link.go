package v1

import (
	"context"
	"time"

	"anti_scam/apiserver/data"
	v1 "anti_scam/apiserver/v1/repo"
	"anti_scam/pkg/ai"
	"anti_scam/pkg/util/ginutil"

	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"
)

// 对前端的统一返回
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

	// 原有数据库查询
	g.Go(func() error {
		res, err := data.CheckLinkStatus(in)
		if err != nil {
			return err
		}
		basicRes = res
		return nil
	})

	// 新增 AI 模型调用
	g.Go(func() error {
		if in.Search == "" { // 兼容你的 req 结构，没传 url 时跳过
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

	// 合并结果
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
