"use client";

import { cn } from "@/lib/utils";
import { AUTH_THEME } from "../constants";

type AuthFeedbackProps = {
  error?: string | null;
  success?: string | null;
  className?: string;
};

/** ข้อความ error (แดง) / สถานะกำลังเข้าสู่ระบบหลังสำเร็จ บนฟอร์ม auth */
export function AuthFeedback({ error, success, className }: AuthFeedbackProps) {
  if (!error && !success) return null;

  if (success) {
    return (
      <div
        role="status"
        className={cn("flex items-center justify-center gap-3 py-2 text-base font-medium", className)}
        style={{ color: AUTH_THEME.title }}
      >
        <span
          className="size-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
        {success}
      </div>
    );
  }

  return (
    <p
      role="alert"
      className={cn(
        "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
        className
      )}
    >
      {error}
    </p>
  );
}
