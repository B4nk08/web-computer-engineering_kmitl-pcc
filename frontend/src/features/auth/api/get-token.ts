import { apiClient, endpoints } from "@/lib/api";
import type { AuthUserDto, LoginInput } from "../types";

export type GetTokenResponseDto = {
  token: string;
  token_type: string;
  user: AuthUserDto;
};

/** POST /api/auth/token — สำหรับเทส JWT (ไม่เขียน session) */
export async function fetchAuthToken(
  input: LoginInput
): Promise<GetTokenResponseDto> {
  return apiClient<GetTokenResponseDto>(endpoints.auth.token, {
    method: "POST",
    token: null,
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });
}
