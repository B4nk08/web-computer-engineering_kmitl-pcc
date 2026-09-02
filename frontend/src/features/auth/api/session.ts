import { setAccessToken } from "@/lib/api";
import { mapAuthUser } from "../mappers";
import type { AuthResponseDto, AuthUser } from "../types";

/** เก็บ JWT หลัง login / register / google สำเร็จ */
export async function persistAuthSession(
  data: AuthResponseDto
): Promise<AuthUser> {
  setAccessToken(data.token);
  return mapAuthUser(data.user);
}

/** ล้าง session ฝั่ง client */
export function clearAuthSession() {
  setAccessToken(null);
}
