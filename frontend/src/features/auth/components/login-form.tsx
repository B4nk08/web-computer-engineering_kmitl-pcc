"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { login } from "../api";
import { AUTH_COPY, AUTH_THEME } from "../constants";
import { postAuthRedirectPath } from "../mappers";
import { validateLogin } from "../lib/validation";
import { useAuth } from "../providers/auth-provider";
import type { AuthUser, LoginFormValues } from "../types";
import { AuthFeedback } from "./auth-feedback";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthTextField } from "./auth-text-field";
import { GoogleAuthButton } from "./google-auth-button";
import { RememberMeSwitch } from "./remember-me-switch";

const REMEMBER_KEY = "ce_auth_remember_email";
const SUCCESS_REDIRECT_MS = 1200;

function readRememberedEmail() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

function readNextPath() {
  try {
    return new URLSearchParams(window.location.search).get("next");
  } catch {
    return null;
  }
}

export function LoginForm({ googleEnabled = true }: { googleEnabled?: boolean }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const email = readRememberedEmail();
    if (!email) return;
    setValues((prev) => ({ ...prev, email, remember: true }));
  }, []);

  function update<K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function finishAuth(user: AuthUser, message: string) {
    setError(null);
    setSuccess(message);
    setUser(user);
    window.setTimeout(() => {
      router.replace(postAuthRedirectPath(user.role, readNextPath()));
    }, SUCCESS_REDIRECT_MS);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateLogin(values);
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await login({
        email: values.email.trim(),
        password: values.password,
      });

      try {
        if (values.remember) {
          window.localStorage.setItem(REMEMBER_KEY, values.email.trim());
        } else {
          window.localStorage.removeItem(REMEMBER_KEY);
        }
      } catch {
        // ignore
      }

      finishAuth(user, AUTH_COPY.loginSuccess);
    } catch (err) {
      setSuccess(null);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "เข้าสู่ระบบไม่สำเร็จ"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto flex w-full max-w-[min(380px,100%)] flex-col gap-4 sm:gap-5"
    >
      <h1
        className="text-center text-2xl font-bold tracking-tight sm:text-[1.85rem]"
        style={{ color: AUTH_THEME.title }}
      >
        {AUTH_COPY.loginTitle}
      </h1>

      <div className="flex flex-col gap-4">
        <AuthTextField
          id="login-email"
          label="Username"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(v) => update("email", v)}
          variant="soft"
        />
        <AuthTextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(v) => update("password", v)}
          variant="soft"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <RememberMeSwitch
          checked={values.remember}
          onCheckedChange={(v) => update("remember", v)}
          label={AUTH_COPY.rememberMe}
        />
        <button
          type="button"
          className="text-sm font-medium hover:underline"
          style={{ color: AUTH_THEME.link }}
          onClick={() => {
            setSuccess(null);
            setError("ฟีเจอร์ลืมรหัสผ่านยังไม่พร้อมใช้งาน");
          }}
        >
          {AUTH_COPY.forgotPassword}
        </button>
      </div>

      <AuthFeedback error={error} success={success} />

      <AuthSubmitButton disabled={submitting || Boolean(success)}>
        {success
          ? "สำเร็จ..."
          : submitting
            ? "กำลังเข้าสู่ระบบ..."
            : AUTH_COPY.loginSubmit}
      </AuthSubmitButton>

      <div className="flex justify-center pt-1">
        <GoogleAuthButton
          variant="login"
          enabled={googleEnabled && !success}
          onSuccess={(user) => finishAuth(user, AUTH_COPY.loginSuccessGoogle)}
          onError={(msg) => {
            setSuccess(null);
            setError(msg);
          }}
        />
      </div>
    </form>
  );
}
