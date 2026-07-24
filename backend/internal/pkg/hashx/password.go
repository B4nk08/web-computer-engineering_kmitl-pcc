// Package hashx ห่อ bcrypt สำหรับ hash / ตรวจสอบรหัสผ่าน
package hashx

import "golang.org/x/crypto/bcrypt"

// Hash แปลงรหัสผ่านเป็น bcrypt hash
func Hash(plain string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// Compare ตรวจว่ารหัสผ่านตรงกับ hash หรือไม่
func Compare(hash, plain string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain)) == nil
}
