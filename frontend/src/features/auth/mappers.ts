import type { AuthUser, AuthUserDto } from "./types";

export function mapAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    displayName: dto.display_name,
    avatarUrl: dto.avatar_url,
    role: dto.role,
  };
}

export function postAuthRedirectPath(role: string, nextPath?: string | null): string {
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    if (nextPath.startsWith("/admin")) {
      if (role === "admin" || role === "teacher") return nextPath;
      return "/";
    }
    return nextPath;
  }
  if (role === "admin" || role === "teacher") return "/admin";
  return "/";
}
