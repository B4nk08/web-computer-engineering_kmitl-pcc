/** Auth feature — types aligned with backend dto/auth.go */

export type AuthMode = "login" | "register";

export type UserRole = "external" | "student" | "teacher" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: UserRole | string;
};

export type AuthUserDto = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  role: string;
};

export type AuthResponseDto = {
  token: string;
  user: AuthUserDto;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  display_name: string;
};

export type GoogleLoginInput = {
  id_token: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
