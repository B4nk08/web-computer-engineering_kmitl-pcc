import { apiClient, endpoints } from "@/lib/api";
import type { AuthResponseDto, AuthUser, GoogleLoginInput } from "../types";
import { persistAuthSession } from "./session";

/** POST /api/auth/google — เข้าสู่ระบบ หรือสมัครบัญชีใหม่ถ้าอีเมลยังไม่มี */
export async function loginWithGoogle(
  input: GoogleLoginInput
): Promise<{ user: AuthUser; created: boolean }> {
  const data = await apiClient<AuthResponseDto>(endpoints.auth.google, {
    method: "POST",
    body: {
      id_token: input.id_token,
    },
  });
  return { user: await persistAuthSession(data), created: Boolean(data.created) };
}
