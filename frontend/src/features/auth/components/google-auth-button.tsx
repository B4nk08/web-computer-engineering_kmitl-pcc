"use client";

import { useEffect, useRef, useState } from "react";
import { AUTH_COPY, AUTH_THEME } from "../constants";
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
  /** mount ปุ่มเฉพาะตอนฟอร์มนี้กำลังแสดง — กัน initialize/render ซ้ำ */
  enabled?: boolean;
  className?: string;
};

export function GoogleAuthButton({
  onSuccess,
  onError,
  enabled = true,
  className,
}: GoogleAuthButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

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
            text: "signin_with",
            width: Math.max(220, Math.round(el.getBoundingClientRect().width) || 240),
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
  }, [enabled]);

  if (!enabled) return null;

  if (!isGoogleOAuthConfigured()) {
    return (
      <p className="text-center text-xs text-red-600">
        ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID ใน .env แล้วรีสตาร์ท frontend
      </p>
    );
  }

  const label = AUTH_COPY.google;

  return (
    <div className={cn("group relative mx-auto h-12 w-fit min-w-[220px]", className)}>
      <div
        className={cn(
          "pointer-events-none flex h-full w-full items-center justify-center gap-3 text-[15px] font-semibold transition",
          (loading || !ready) && "opacity-70"
        )}
        style={{ color: AUTH_THEME.title }}
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
          {loading ? "กำลังเข้าสู่ระบบ..." : !ready ? "กำลังโหลด Google..." : label}
        </span>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-white shadow-[0_3px_10px_rgba(0,34,80,0.18)] ring-1 ring-black/5 transition duration-200 group-hover:scale-105 group-hover:shadow-[0_6px_16px_rgba(0,34,80,0.24)]">
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-[#4285F4]/25 border-t-[#4285F4]" />
          ) : (
            <GoogleMark />
          )}
        </span>
      </div>
      <div
        ref={hostRef}
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full opacity-0",
          (loading || !ready) && "pointer-events-none"
        )}
      />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
