// Package cecohort แปลงรหัสนักศึกษา → ชื่อรุ่น CE
//
// กฎ: รหัสขึ้นต้น 64 = CE01 (รุ่นแรก) จากนั้น +1 ต่อปี
// 65 = CE02, 66 = CE03, 67 = CE04, ...
package cecohort

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

const (
	FirstCohortPrefix = 64
	FirstCohortNumber = 1
)

var prefixRe = regexp.MustCompile(`^(\d{2})`)

// Prefix ดึง 2 หลักแรกของรหัสนักศึกษา
func Prefix(studentCode string) (int, bool) {
	studentCode = strings.TrimSpace(studentCode)
	m := prefixRe.FindStringSubmatch(studentCode)
	if m == nil {
		return 0, false
	}
	n, err := strconv.Atoi(m[1])
	if err != nil {
		return 0, false
	}
	return n, true
}

// Number หมายเลขรุ่น (1, 2, 3, …) — 64 → 1
func Number(studentCode string) (int, bool) {
	prefix, ok := Prefix(studentCode)
	if !ok {
		return 0, false
	}
	num := prefix - FirstCohortPrefix + FirstCohortNumber
	if num < 1 {
		return 0, false
	}
	return num, true
}

// Label ชื่อรุ่น เช่น "CE01", "CE02"
func Label(studentCode string) (string, bool) {
	num, ok := Number(studentCode)
	if !ok {
		return "", false
	}
	return fmt.Sprintf("CE%02d", num), true
}
