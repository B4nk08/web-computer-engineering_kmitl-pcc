// Package httpx รวม helper สำหรับ response รูปแบบเดียวกันทั้ง API
package httpx

import "github.com/gin-gonic/gin"

// Envelope คือรูปแบบ response มาตรฐาน
type Envelope struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

// OK ส่งข้อมูลสำเร็จ (200)
func OK(c *gin.Context, data any) {
	c.JSON(200, Envelope{Success: true, Data: data})
}

// Created ส่งข้อมูลเมื่อสร้างสำเร็จ (201)
func Created(c *gin.Context, data any) {
	c.JSON(201, Envelope{Success: true, Data: data})
}

// Fail ส่ง error พร้อม status code
func Fail(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, Envelope{Success: false, Error: message})
}
