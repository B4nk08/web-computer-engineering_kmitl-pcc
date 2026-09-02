"use client";

import { useEffect, useRef, useState } from "react";
import { AUTH_THEME } from "../constants";
import { isGoogleOAuthConfigured } from "../config/env";
import { loginWithGoogle } from "../api";
import {
  currentOriginHint,
  mountGoogleSignInButton,
  originNotAllowedMessage,
  setGoogleCredentialHandler,
} from "../lib/google-gsi";
import type { AuthUser } from "../types";
import { cn } from "@/lib/utils";

type GoogleAuthButtonProps = {
  onSuccess: (user: AuthUser) => void;
  onError: (message: string) => void;
  variant?: "login" | "register";
  /** mount ปุ่มเฉพาะตอนฟอร์มนี้กำลังแสดง — กัน initialize/render ซ้ำ */
  enabled?: boolean;
  className?: string;
};

export function GoogleAuthButton({
  onSuccess,
  onError,
  variant = "register",
  enabled = true,
  className,
}: GoogleAuthButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [originHint, setOriginHint] = useState("");

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      const el = hostRef.current;
      if (el) el.innerHTML = "";
      return;
    }

    if (!isGoogleOAuthConfigured()) {
      onErrorRef.current(
        `ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID — และใน Google Cloud ต้องมี Authorized JavaScript origins = ${currentOriginHint()}`
      );
      return;
    }

    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;
    setOriginHint(currentOriginHint());

    void (async () => {
      try {
        await mountGoogleSignInButton(
          el,
          async (idToken) => {
            setLoading(true);
            try {
              const user = await loginWithGoogle({ id_token: idToken });
              if (!cancelled) onSuccessRef.current(user);
            } catch (err) {
              if (!cancelled) {
                onErrorRef.current(
                  err instanceof Error
                    ? err.message
                    : "เข้าสู่ระบบด้วย Google ไม่สำเร็จ"
                );
              }
            } finally {
              if (!cancelled) setLoading(false);
            }
          },
          {
            text: variant === "register" ? "signup_with" : "signin_with",
            width: variant === "login" ? 260 : 280,
          }
        );
        if (!cancelled) setReady(true);

        // ถ้า iframe ปุ่มโดน 403 มักจะว่าง — แจ้ง origin หลังสั้น ๆ
        window.setTimeout(() => {
          if (cancelled || !el.isConnected) return;
          const hasIframe = el.querySelector("iframe");
          if (!hasIframe) {
            onErrorRef.current(originNotAllowedMessage());
          }
        }, 1500);
      } catch (err) {
        if (!cancelled) {
          onErrorRef.current(
            err instanceof Error
              ? `${err.message} — ตรวจ Authorized JavaScript origins ให้มี ${currentOriginHint()}`
              : originNotAllowedMessage()
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      setGoogleCredentialHandler(null);
      if (el) el.innerHTML = "";
      setReady(false);
    };
  }, [enabled, variant]);

  if (!enabled) return null;

  if (!isGoogleOAuthConfigured()) {
    return (
      <p className="text-center text-xs text-red-600">
        ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID ใน .env แล้วรีสตาร์ท frontend
      </p>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center gap-2",
        className
      )}
    >
      {loading ? (
        <p className="text-xs" style={{ color: AUTH_THEME.muted }}>
          กำลังเข้าสู่ระบบด้วย Google...
        </p>
      ) : null}
      {!ready && !loading ? (
        <p className="text-xs" style={{ color: AUTH_THEME.muted }}>
          กำลังโหลดปุ่ม Google...
        </p>
      ) : null}
      <div
        ref={hostRef}
        className={cn(
          "flex min-h-11 w-full max-w-[280px] items-center justify-center overflow-hidden rounded-full",
          loading && "pointer-events-none opacity-60"
        )}
      />
      {originHint ? (
        <p className="max-w-[280px] text-center text-[10px] leading-snug text-neutral-400">
          Origin ที่ต้องอนุญาตใน Google Cloud:{" "}
          <span className="font-mono text-neutral-500">{originHint}</span>
        </p>
      ) : null}
    </div>
  );
}
