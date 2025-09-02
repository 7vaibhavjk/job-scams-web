package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const XRequestIDKey = "XRequestID"

// RequestIDMiddleware Generate a unique request ID and store it in the context
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.New().String()
		c.Set(XRequestIDKey, requestID)
		c.Header("X-Request-ID", requestID)
		c.Next()
	}
}
