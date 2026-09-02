import { apiClient, endpoints } from "@/lib/api";
import type { AuthResponseDto, AuthUser, RegisterInput } from "../types";
import { persistAuthSession } from "./session";

/** POST /api/auth/register */
export async function register(input: RegisterInput): Promise<AuthUser> {
  const data = await apiClient<AuthResponseDto>(endpoints.auth.register, {
    method: "POST",
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      display_name: input.display_name.trim(),
    },
  });
  return persistAuthSession(data);
}
