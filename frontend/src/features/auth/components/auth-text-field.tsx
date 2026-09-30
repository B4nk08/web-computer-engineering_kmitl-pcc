"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_THEME } from "../constants";

type AuthTextFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  /** floating = outline, soft = recessed */
  variant?: "floating" | "soft";
  /** แจ้งเตือนเมื่อ Caps Lock เปิดอยู่ (ใช้กับช่องรหัสผ่าน) */
  warnCapsLock?: boolean;
  invalid?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
};

const INVALID_COLOR = "#dc2626";

function RevealButton({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-[#8A94AD] transition hover:text-[#002250] focus-visible:ring-2 focus-visible:ring-[#1A4B9B]/30 focus-visible:outline-none"
      aria-label={shown ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
    >
      {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

export function AuthTextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  variant = "soft",
  warnCapsLock = false,
  invalid = false,
  onFocus,
  onBlur,
  className,
}: AuthTextFieldProps) {
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const inputType = isPassword && revealed ? "text" : type;

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (warnCapsLock) setCapsOn(e.getModifierState("CapsLock"));
  }

  const inputProps = {
    id,
    type: inputType,
    value,
    autoComplete,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    onKeyDown: handleKey,
    onKeyUp: handleKey,
    onFocus,
    onBlur: () => {
      setCapsOn(false);
      onBlur?.();
    },
    "aria-invalid": invalid || undefined,
  };

  const capsHint =
    warnCapsLock && capsOn ? (
      <p className="mt-1.5 px-1 text-xs font-medium text-[#c2410c]">Caps Lock เปิดอยู่</p>
    ) : null;

  if (variant === "floating") {
    return (
      <div className={cn("relative pt-1", className)}>
        <label
          htmlFor={id}
          className="absolute -top-0.5 left-3.5 z-10 bg-white px-1.5 text-[13px] font-medium"
          style={{ color: invalid ? INVALID_COLOR : AUTH_THEME.title }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            {...inputProps}
            className={cn(
              "h-11 w-full rounded-[10px] border bg-white px-4 text-sm outline-none transition focus:ring-2 sm:h-12 sm:text-[15px]",
              invalid ? "focus:ring-[#dc2626]/20" : "focus:ring-[#1A4B9B]/25",
              isPassword && "pr-11",
            )}
            style={{
              borderColor: invalid ? INVALID_COLOR : AUTH_THEME.inputBorder,
              color: AUTH_THEME.title,
              boxShadow: "2px 3px 0 rgba(26, 39, 68, 0.06)",
            }}
          />
          {isPassword ? (
            <RevealButton shown={revealed} onToggle={() => setRevealed((v) => !v)} />
          ) : null}
        </div>
        {capsHint}
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          placeholder={label}
          className={cn(
            "h-11 w-full rounded-[12px] border-0 px-4 text-sm outline-none transition placeholder:text-[#9AA3B8] focus:ring-2 focus:ring-[#1A4B9B]/30 sm:h-12 sm:rounded-[14px] sm:px-5 sm:text-[15px]",
            invalid && "ring-2 ring-[#dc2626]/50 focus:ring-[#dc2626]/50",
            isPassword && "pr-11 sm:pr-12",
          )}
          style={{
            backgroundColor: AUTH_THEME.inputSoft,
            color: AUTH_THEME.title,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
          }}
        />
        {isPassword ? (
          <RevealButton shown={revealed} onToggle={() => setRevealed((v) => !v)} />
        ) : null}
      </div>
      {capsHint}
    </div>
  );
}
