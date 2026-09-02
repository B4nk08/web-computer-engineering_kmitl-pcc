export { login } from "./login";
export { register } from "./register";
export { loginWithGoogle } from "./google";
export { fetchAuthToken } from "./get-token";
export type { GetTokenResponseDto } from "./get-token";
export { fetchMe } from "./me";
export { persistAuthSession, clearAuthSession } from "./session";

/** alias ชื่อเดิม */
export { clearAuthSession as logout } from "./session";
