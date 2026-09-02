import { apiClient, endpoints } from "@/lib/api";
import type { AuthResponseDto, AuthUser, LoginInput } from "../types";
import { persistAuthSession } from "./session";

/** POST /api/auth/login */
export async function login(input: LoginInput): Promise<AuthUser> {
  const data = await apiClient<AuthResponseDto>(endpoints.auth.login, {
    method: "POST",
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });
  return persistAuthSession(data);
}
