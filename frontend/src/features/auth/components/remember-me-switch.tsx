"use client";

import { cn } from "@/lib/utils";
import { AUTH_THEME } from "../constants";

type RememberMeSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

/** Login: small rounded checkbox */
export function RememberMeSwitch({
  checked,
  onCheckedChange,
  label,
}: RememberMeSwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "flex size-[18px] items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-[#002250] bg-[#002250] text-white"
            : "border-[#C5CBD8] bg-white"
        )}
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>
      <span className="text-sm" style={{ color: AUTH_THEME.title }}>
        {label}
      </span>
    </label>
  );
}
