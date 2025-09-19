package main

import (
	"anti_scam/apiserver/routes"
	"anti_scam/pkg/db"
	"anti_scam/pkg/middleware"
	"anti_scam/scanner"
	"log"
	_ "net/http/pprof"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("The program panics: %v", r)
		}
	}()
	var g *gin.Engine
	g = gin.Default()

	corsConfig := cors.Config{
		AllowOrigins:     []string{"*"},                                       // 允许所有来源，或者指定特定来源如 http://example.com
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // 允许的 HTTP 方法
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // 允许的头部字段
		AllowCredentials: true,                                                // 允许带凭证请求
		MaxAge:           12 * time.Hour,                                      // 设置缓存预检请求的时间
	}

	// Setup CORS middleware
	g.Use(cors.New(corsConfig))
	g.Use(middleware.RequestIDMiddleware())

	log.SetFlags(0)
	log.SetOutput(os.Stdout)

	routes.ApiService(g)

	db.Connect()

	scanner.ProcessCSV()
	//scanner.ScamRecordHandler()

	if err := g.Run(":8003"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
