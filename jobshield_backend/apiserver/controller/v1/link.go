package v1

import (
	"anti_scam/apiserver/data"
	v1 "anti_scam/apiserver/v1/repo"
	"anti_scam/pkg/util/ginutil"

	"github.com/gin-gonic/gin"
)

func QueryLinkIsSafe(c *gin.Context) {
	var queryLinkReq v1.QueryLinkSafeReq
	if err := c.ShouldBindBodyWithJSON(&queryLinkReq); err != nil {
		ginutil.WriteResponse(c, err, nil)
		return
	}
	allData, err := data.CheckLinkStatus(queryLinkReq)
	if err != nil {
		ginutil.WriteResponseErr(c, err, nil)
		return
	}
	ginutil.WriteResponse(c, nil, allData)
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
