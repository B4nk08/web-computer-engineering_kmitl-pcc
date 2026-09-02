"use client";

import { cn } from "@/lib/utils";
import { AUTH_THEME } from "../constants";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function AuthSubmitButton({
  children,
  disabled,
  className,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "h-12 w-full max-w-full text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:h-14 sm:text-[17px]",
        className
      )}
      style={{
        maxWidth: AUTH_THEME.buttonWidth,
        borderRadius: AUTH_THEME.buttonRadius,
        backgroundImage: `linear-gradient(90deg, ${AUTH_THEME.gradientFrom} 0%, ${AUTH_THEME.gradientTo} 100%)`,
        boxShadow: AUTH_THEME.buttonShadow,
      }}
    >
      {children}
    </button>
  );
}
