const TOKEN_KEY = "ce_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore quota / private mode
  }
}
