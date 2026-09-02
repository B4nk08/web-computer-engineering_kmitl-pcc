import { apiClient, endpoints } from "@/lib/api";
import { mapAuthUser } from "../mappers";
import type { AuthUser, AuthUserDto } from "../types";

/** GET /api/auth/me — ต้องมี Bearer token */
export async function fetchMe(): Promise<AuthUser> {
  const data = await apiClient<AuthUserDto>(endpoints.auth.me, {
    method: "GET",
  });
  return mapAuthUser(data);
}
