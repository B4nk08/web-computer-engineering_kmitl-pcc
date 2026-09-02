"use client";

import { useEffect, useState } from "react";
import { AUTH_THEME } from "../constants";
import type { AuthMode } from "../types";
import { AuthModeToggle } from "./auth-mode-toggle";
import { AuthWelcomePanel } from "./auth-welcome-panel";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { cn } from "@/lib/utils";

type AuthSplitCardProps = {
  mode: AuthMode;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = "550ms";

/**
 * การ์ดขาว / น้ำเงินสูงเท่ากัน ขอบบน–ล่างชิด + สไลด์ + responsive
 */
export function AuthSplitCard({ mode }: AuthSplitCardProps) {
  const isLogin = mode === "login";
  const cardH = `min(${AUTH_THEME.cardHeight}px, 78svh)`;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // mount Google button แค่ฟอร์มที่มองเห็นจริง (กัน initialize / iframe ซ้ำ)
  const googleOnMobileLogin = !isDesktop && isLogin;
  const googleOnMobileRegister = !isDesktop && !isLogin;
  const googleOnDesktopLogin = isDesktop && isLogin;
  const googleOnDesktopRegister = isDesktop && !isLogin;

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: `min(${AUTH_THEME.cardWidth}px, 94vw)` }}
    >
      {/* Mobile */}
      <div
        className="overflow-hidden bg-white shadow-[0_20px_48px_rgba(0,0,0,0.32)] md:hidden"
        style={{ borderRadius: AUTH_THEME.cardRadius }}
      >
        <div
          className="flex justify-center px-4 pt-4 pb-2 sm:pt-5"
          style={{ backgroundColor: AUTH_THEME.panel }}
        >
          <AuthModeToggle mode={mode} />
        </div>
        <div className="relative px-5 py-8 sm:px-8 sm:py-10">
          <div
            className={cn(
              "transition-all duration-500",
              isLogin
                ? "relative opacity-100 translate-y-0"
                : "pointer-events-none absolute inset-x-5 top-8 opacity-0 -translate-y-2 sm:inset-x-8 sm:top-10"
            )}
            style={{ transitionTimingFunction: EASE }}
            aria-hidden={!isLogin}
          >
            <LoginForm googleEnabled={googleOnMobileLogin} />
          </div>
          <div
            className={cn(
              "transition-all duration-500",
              !isLogin
                ? "relative opacity-100 translate-y-0"
                : "pointer-events-none absolute inset-x-5 top-8 opacity-0 translate-y-2 sm:inset-x-8 sm:top-10"
            )}
            style={{ transitionTimingFunction: EASE }}
            aria-hidden={isLogin}
          >
            <RegisterForm googleEnabled={googleOnMobileRegister} />
          </div>
        </div>
      </div>

      {/* Desktop — fixed height so both cards align */}
      <div className="relative hidden md:block" style={{ height: cardH }}>
        {/* Login white */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[56%] items-center overflow-y-auto px-8 py-8 lg:px-12",
            "transition-all duration-500",
            isLogin
              ? "z-[1] opacity-100 translate-x-0"
              : "pointer-events-none z-0 -translate-x-4 opacity-0"
          )}
          style={{
            borderRadius: AUTH_THEME.cardRadius,
            backgroundColor: AUTH_THEME.white,
            boxShadow: AUTH_THEME.shadow,
            transitionTimingFunction: EASE,
            transitionDuration: DURATION,
          }}
          aria-hidden={!isLogin}
        >
          <LoginForm googleEnabled={googleOnDesktopLogin} />
        </div>

        {/* Register white */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[56%] items-center overflow-y-auto px-8 py-8 lg:px-12",
            "transition-all duration-500",
            !isLogin
              ? "z-[1] opacity-100 translate-x-0"
              : "pointer-events-none z-0 translate-x-4 opacity-0"
          )}
          style={{
            borderRadius: AUTH_THEME.cardRadius,
            backgroundColor: AUTH_THEME.white,
            boxShadow: AUTH_THEME.shadow,
            transitionTimingFunction: EASE,
            transitionDuration: DURATION,
          }}
          aria-hidden={isLogin}
        >
          <RegisterForm googleEnabled={googleOnDesktopRegister} />
        </div>

        {/* Navy — same top/bottom as white */}
        <div
          className="absolute inset-y-0 z-10"
          style={{
            width: `min(52%, ${AUTH_THEME.panelWidth}px)`,
            borderRadius: AUTH_THEME.cardRadius,
            backgroundColor: AUTH_THEME.panel,
            boxShadow: AUTH_THEME.panelShadow,
            left: isLogin ? "48%" : "0%",
            transitionProperty: "left",
            transitionDuration: DURATION,
            transitionTimingFunction: EASE,
          }}
        >
          <AuthWelcomePanel mode={mode} className="h-full" />
        </div>
      </div>
    </div>
  );
}
