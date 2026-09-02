"use client";

import { cn } from "@/lib/utils";

type AuthFeedbackProps = {
  error?: string | null;
  success?: string | null;
  className?: string;
};

/** ข้อความ error (แดง) / success (เขียว) บนฟอร์ม auth */
export function AuthFeedback({ error, success, className }: AuthFeedbackProps) {
  if (!error && !success) return null;

  if (success) {
    return (
      <p
        role="status"
        className={cn(
          "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800",
          className
        )}
      >
        {success}
      </p>
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
