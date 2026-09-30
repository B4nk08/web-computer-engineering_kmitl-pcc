"use client";

import { useEffect, useState } from "react";
import { AUTH_THEME } from "../constants";
import { AuthWelcomePanel } from "./auth-welcome-panel";
import { LoginForm } from "./login-form";

/**
 * การ์ดขาว (ฟอร์ม) + การ์ดน้ำเงิน (ต้อนรับ) สูงเท่ากัน — responsive
 */
export function AuthSplitCard() {
  const cardH = `min(${AUTH_THEME.cardHeight}px, 78svh)`;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
        <div style={{ backgroundColor: AUTH_THEME.panel }}>
          <AuthWelcomePanel className="py-7" />
        </div>
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          {/* mount Google button เฉพาะฟอร์มที่มองเห็นจริง (กัน initialize / iframe ซ้ำ) */}
          <LoginForm googleEnabled={!isDesktop} />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden md:block" style={{ height: cardH }}>
        <div
          className="absolute inset-y-0 right-0 flex w-[56%] items-center overflow-y-auto px-8 py-8 lg:px-12"
          style={{
            borderRadius: AUTH_THEME.cardRadius,
            backgroundColor: AUTH_THEME.white,
            boxShadow: AUTH_THEME.shadow,
          }}
        >
          <LoginForm googleEnabled={isDesktop} />
        </div>

        <div
          className="absolute inset-y-0 left-0 z-10"
          style={{
            width: `min(52%, ${AUTH_THEME.panelWidth}px)`,
            borderRadius: AUTH_THEME.cardRadius,
            backgroundColor: AUTH_THEME.panel,
            boxShadow: AUTH_THEME.panelShadow,
          }}
        >
          <AuthWelcomePanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
