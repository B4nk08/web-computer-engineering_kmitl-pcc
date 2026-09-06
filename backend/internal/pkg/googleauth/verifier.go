// Package googleauth ตรวจสอบ Google ID token ผ่าน tokeninfo endpoint
// (เลี่ยง dependency หนักของ google.golang.org/api)
package googleauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const tokenInfoURL = "https://oauth2.googleapis.com/tokeninfo"

var (
	ErrMissingClientID   = errors.New("GOOGLE_CLIENT_ID is not configured")
	ErrInvalidToken      = errors.New("invalid google id token")
	ErrAudienceMismatch  = errors.New("google token audience mismatch")
	ErrEmailNotVerified  = errors.New("google email not verified")
	ErrGoogleUnreachable = errors.New("cannot reach Google tokeninfo")
)

// Payload คือข้อมูลผู้ใช้ที่ได้จาก Google
type Payload struct {
	Sub           string
	Email         string
	EmailVerified bool
	Name          string
	Picture       string
}

// Verifier ตรวจสอบ id token กับ Google
type Verifier struct {
	clientID string
	client   *http.Client
}

func NewVerifier(clientID string) *Verifier {
	return &Verifier{
		clientID: strings.TrimSpace(clientID),
		client:   &http.Client{Timeout: 15 * time.Second},
	}
}

// Verify เรียก Google เพื่อยืนยัน id token แล้วคืนข้อมูลผู้ใช้
// ใช้ POST (ไม่ใส่ JWT ใน query) เพราะ id_token ยาวมาก — GET มักพัง/ถูกตัด
func (v *Verifier) Verify(ctx context.Context, idToken string) (*Payload, error) {
	idToken = strings.TrimSpace(idToken)
	if idToken == "" {
		return nil, ErrInvalidToken
	}
	if v.clientID == "" {
		return nil, ErrMissingClientID
	}

	form := url.Values{"id_token": {idToken}}.Encode()
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		tokenInfoURL,
		strings.NewReader(form),
	)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := v.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrGoogleUnreachable, err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, fmt.Errorf("read tokeninfo: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%w: google status %d body %s", ErrInvalidToken, resp.StatusCode, truncate(string(body), 180))
	}

	// tokeninfo คืนค่าเป็น string เป็นหลัก แต่บางฟิลด์อาจเป็น number/bool
	var raw map[string]any
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, fmt.Errorf("decode tokeninfo: %w", err)
	}

	aud := asString(raw["aud"])
	if aud == "" || aud != v.clientID {
		return nil, fmt.Errorf("%w: got %q want %q", ErrAudienceMismatch, aud, v.clientID)
	}

	email := asString(raw["email"])
	sub := asString(raw["sub"])
	if email == "" || sub == "" {
		return nil, ErrInvalidToken
	}

	if !asBool(raw["email_verified"]) {
		return nil, ErrEmailNotVerified
	}

	return &Payload{
		Sub:           sub,
		Email:         email,
		EmailVerified: true,
		Name:          asString(raw["name"]),
		Picture:       asString(raw["picture"]),
	}, nil
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "..."
}

func asString(v any) string {
	switch t := v.(type) {
	case string:
		return t
	case float64:
		return fmt.Sprintf("%.0f", t)
	case json.Number:
		return t.String()
	case bool:
		if t {
			return "true"
		}
		return "false"
	default:
		return ""
	}
}

func asBool(v any) bool {
	switch t := v.(type) {
	case bool:
		return t
	case string:
		s := strings.ToLower(strings.TrimSpace(t))
		return s == "true" || s == "1"
	case float64:
		return t != 0
	default:
		return false
	}
}
