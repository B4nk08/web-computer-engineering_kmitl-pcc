/** Auth env — Google OAuth + API */

export const AUTH_ENV = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || "",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080",
} as const;

export const isGoogleOAuthConfigured = () => Boolean(AUTH_ENV.googleClientId);
