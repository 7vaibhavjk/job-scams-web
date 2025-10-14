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
		AllowOrigins:     []string{"*"},                                       // Allow all origins, or specify specific origins like http://example.com
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed header fields
		AllowCredentials: true,                                                // Allow requests with credentials
		MaxAge:           12 * time.Hour,                                      // Set cache preflight request time
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
