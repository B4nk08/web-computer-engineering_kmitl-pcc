/** Auth env — Google OAuth + API */

export const AUTH_ENV = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || "",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080",
  /** true = ข้าม login (dev ชั่วคราว — อย่าเปิดบน production) */
  authBypass: process.env.NEXT_PUBLIC_AUTH_BYPASS === "true",
} as const;

export const isGoogleOAuthConfigured = () => Boolean(AUTH_ENV.googleClientId);

export const isAuthBypassEnabled = () => AUTH_ENV.authBypass;
