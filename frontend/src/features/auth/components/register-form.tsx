"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { register } from "../api";
import { AUTH_COPY, AUTH_THEME } from "../constants";
import { postAuthRedirectPath } from "../mappers";
import { validateRegister } from "../lib/validation";
import { useAuth } from "../providers/auth-provider";
import type { AuthUser, RegisterFormValues } from "../types";
import { AuthFeedback } from "./auth-feedback";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthTextField } from "./auth-text-field";
import { GoogleAuthButton } from "./google-auth-button";

const SUCCESS_REDIRECT_MS = 1400;

export function RegisterForm({
  googleEnabled = true,
}: {
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function finishAuth(user: AuthUser, message: string) {
    setError(null);
    setSuccess(message);
    setUser(user);
    window.setTimeout(() => {
      router.replace(postAuthRedirectPath(user.role));
    }, SUCCESS_REDIRECT_MS);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateRegister(values);
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await register({
        email: values.email.trim(),
        password: values.password,
        display_name: values.name.trim(),
      });
      finishAuth(user, AUTH_COPY.registerSuccess);
    } catch (err) {
      setSuccess(null);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "สมัครสมาชิกไม่สำเร็จ"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto flex w-full max-w-[min(380px,100%)] flex-col gap-3 sm:gap-3.5"
    >
      <div className="mb-1 text-center">
        <h1
          className="text-2xl font-bold tracking-tight sm:text-[1.85rem]"
          style={{ color: AUTH_THEME.title }}
        >
          {AUTH_COPY.registerTitle}
        </h1>
        <p className="mt-1 text-sm" style={{ color: AUTH_THEME.muted }}>
          {AUTH_COPY.registerHint}
        </p>
      </div>

      <AuthTextField
        id="register-name"
        label="Name"
        autoComplete="name"
        value={values.name}
        onChange={(v) => update("name", v)}
        variant="floating"
      />
      <AuthTextField
        id="register-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(v) => update("email", v)}
        variant="floating"
      />
      <AuthTextField
        id="register-password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(v) => update("password", v)}
        variant="floating"
      />
      <AuthTextField
        id="register-confirm"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(v) => update("confirmPassword", v)}
        variant="floating"
      />

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-[#D0D6E4]" />
        <span className="text-sm" style={{ color: AUTH_THEME.muted }}>
          {AUTH_COPY.or}
        </span>
        <div className="h-px flex-1 bg-[#D0D6E4]" />
      </div>

      <div className="flex justify-center">
        <GoogleAuthButton
          variant="register"
          enabled={googleEnabled && !success}
          onSuccess={(user) =>
            finishAuth(user, AUTH_COPY.registerSuccessGoogle)
          }
          onError={(msg) => {
            setSuccess(null);
            setError(msg);
          }}
        />
      </div>

      <AuthFeedback error={error} success={success} />

      <AuthSubmitButton
        disabled={submitting || Boolean(success)}
        className="mt-1"
      >
        {success
          ? "สำเร็จ..."
          : submitting
            ? "กำลังสมัคร..."
            : AUTH_COPY.registerSubmit}
      </AuthSubmitButton>
    </form>
  );
}
