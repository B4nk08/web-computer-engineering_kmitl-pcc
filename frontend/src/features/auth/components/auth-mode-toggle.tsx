"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AuthMode } from "../types";

type AuthModeToggleProps = {
  mode: AuthMode;
  className?: string;
};

function softNavigate(router: ReturnType<typeof useRouter>, href: string) {
  const go = () => router.push(href);
  const doc = typeof document !== "undefined" ? document : null;
  if (doc && "startViewTransition" in doc) {
    (
      doc as Document & {
        startViewTransition: (cb: () => void) => void;
      }
    ).startViewTransition(go);
    return;
  }
  go();
}

/** Sign in / Sign up — soft navigate + สีปุ่มเปลี่ยนแบบ transition */
export function AuthModeToggle({ mode, className }: AuthModeToggleProps) {
  const router = useRouter();

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          if (mode !== "login") softNavigate(router, "/login");
        }}
        className={cn(
          "rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300",
          mode === "login"
            ? "bg-white text-[#002250] shadow-sm"
            : "border border-white/80 bg-transparent text-white hover:bg-white/10"
        )}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => {
          if (mode !== "register") softNavigate(router, "/register");
        }}
        className={cn(
          "rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300",
          mode === "register"
            ? "bg-white text-[#002250] shadow-sm"
            : "border border-white/80 bg-transparent text-white hover:bg-white/10"
        )}
      >
        Sign up
      </button>
    </div>
  );
}
