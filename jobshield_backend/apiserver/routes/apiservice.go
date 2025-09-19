package routes

import (
	v1 "anti_scam/apiserver/controller/v1"

	"github.com/gin-gonic/gin"
)

func ApiService(g *gin.Engine) *gin.Engine {
	api := g.Group("/api/v1")
	{
		link := api.Group("link/check")
		{
			link.POST("/check", v1.QueryLinkIsSafe)
			link.POST("/query/all", v1.QueryLinkList)
		}
		cert := api.Group("report/portal")
		{
			cert.POST("/add", v1.AddDangerLink)
		}
		record := api.Group("record")
		{
			record.GET("/query", v1.GetScamRecords)
		}
	}
	return g
}
