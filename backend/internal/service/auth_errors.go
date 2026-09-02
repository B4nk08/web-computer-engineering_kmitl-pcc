package service

import "errors"

// Error กลางของ auth (handler เอาไป map เป็น HTTP status)
var (
	ErrEmailTaken         = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrOAuthOnlyAccount   = errors.New("account uses google sign-in")
	ErrGoogleVerify       = errors.New("google verification failed")
)
