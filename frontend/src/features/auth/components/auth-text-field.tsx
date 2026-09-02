"use client";

import { cn } from "@/lib/utils";
import { AUTH_THEME } from "../constants";

type AuthTextFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  /** floating = register outline, soft = login recessed */
  variant?: "floating" | "soft";
  className?: string;
};

export function AuthTextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  variant = "soft",
  className,
}: AuthTextFieldProps) {
  if (variant === "floating") {
    return (
      <div className={cn("relative pt-1", className)}>
        <label
          htmlFor={id}
          className="absolute -top-0.5 left-3.5 z-10 bg-white px-1.5 text-[13px] font-medium"
          style={{ color: AUTH_THEME.title }}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-[10px] border bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-[#1A4B9B]/25 sm:h-12 sm:text-[15px]"
          style={{
            borderColor: AUTH_THEME.inputBorder,
            color: AUTH_THEME.title,
            boxShadow: "2px 3px 0 rgba(26, 39, 68, 0.06)",
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={label}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-[12px] border-0 px-4 text-sm outline-none transition placeholder:text-[#9AA3B8] focus:ring-2 focus:ring-[#1A4B9B]/30 sm:h-12 sm:rounded-[14px] sm:px-5 sm:text-[15px]"
        style={{
          backgroundColor: AUTH_THEME.inputSoft,
          color: AUTH_THEME.title,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
        }}
      />
    </div>
  );
}
