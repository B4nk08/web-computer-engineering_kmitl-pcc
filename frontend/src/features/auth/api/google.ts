import { apiClient, endpoints } from "@/lib/api";
import type { AuthResponseDto, AuthUser, GoogleLoginInput } from "../types";
import { persistAuthSession } from "./session";

/** POST /api/auth/google — ส่ง Google ID token */
export async function loginWithGoogle(
  input: GoogleLoginInput
): Promise<AuthUser> {
  const data = await apiClient<AuthResponseDto>(endpoints.auth.google, {
    method: "POST",
    body: {
      id_token: input.id_token,
    },
  });
  return persistAuthSession(data);
}
