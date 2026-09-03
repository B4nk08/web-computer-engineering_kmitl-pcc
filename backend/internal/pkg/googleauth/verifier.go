// Package googleauth ตรวจสอบ Google ID token ผ่าน tokeninfo endpoint
// (เลี่ยง dependency หนักของ google.golang.org/api)
package googleauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

const tokenInfoURL = "https://oauth2.googleapis.com/tokeninfo"

var (
	ErrInvalidToken    = errors.New("invalid google id token")
	ErrAudienceMismatch = errors.New("google token audience mismatch")
	ErrEmailNotVerified = errors.New("google email not verified")
)

// Payload คือข้อมูลผู้ใช้ที่ได้จาก Google
type Payload struct {
	Sub           string
	Email         string
	EmailVerified bool
	Name          string
	Picture       string
}

// rawTokenInfo map ตรงกับ JSON ที่ tokeninfo ส่งกลับ (ค่าเป็น string ทั้งหมด)
type rawTokenInfo struct {
	Aud           string `json:"aud"`
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	ExpiresIn     string `json:"expires_in"`
}

// Verifier ตรวจสอบ id token กับ Google
type Verifier struct {
	clientID string
	client   *http.Client
}

func NewVerifier(clientID string) *Verifier {
	return &Verifier{
		clientID: clientID,
		client:   &http.Client{Timeout: 10 * time.Second},
	}
}

// Verify เรียก Google เพื่อยืนยัน id token แล้วคืนข้อมูลผู้ใช้
func (v *Verifier) Verify(ctx context.Context, idToken string) (*Payload, error) {
	endpoint := tokenInfoURL + "?" + url.Values{"id_token": {idToken}}.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}

	resp, err := v.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, ErrInvalidToken
	}

	var info rawTokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("decode tokeninfo: %w", err)
	}

	// ตรวจ audience ให้ตรงกับ client id ของเรา (ถ้าตั้งค่าไว้)
	if v.clientID != "" && info.Aud != v.clientID {
		return nil, ErrAudienceMismatch
	}

	if info.EmailVerified != "true" {
		return nil, ErrEmailNotVerified
	}

	return &Payload{
		Sub:           info.Sub,
		Email:         info.Email,
		EmailVerified: true,
		Name:          info.Name,
		Picture:       info.Picture,
	}, nil
}
