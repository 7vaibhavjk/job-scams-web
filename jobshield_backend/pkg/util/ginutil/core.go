package ginutil

import "github.com/gin-gonic/gin"

const (
	XRequestID = "XRequestID"
)

type Response struct {
	Code      string      `json:"code"`
	Message   string      `json:"message"`
	RequestID string      `json:"request_id"`
	Data      interface{} `json:"data"`
}

func WriteResponse(c *gin.Context, err error, data interface{}) {
	httpStatus := c.GetInt("httpCode")
	if httpStatus == 0 {
		httpStatus = 200
	}
	rsp := Response{
		Code:      "Success",
		Message:   "",
		RequestID: c.GetString(XRequestID),
		Data:      data,
	}
	c.JSON(httpStatus, rsp)
}

func WriteResponseErr(c *gin.Context, err error, data interface{}) {
	httpStatus := 200
	rsp := Response{
		Code:      "Fail",
		Message:   err.Error(),
		RequestID: c.GetString(XRequestID),
		Data:      data,
	}

	c.JSON(httpStatus, rsp)
}
