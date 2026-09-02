import type { ReactNode } from "react";
import { AUTH_THEME } from "../constants";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className="auth-shell relative min-h-svh overflow-x-hidden overflow-y-auto text-white"
      style={{ backgroundColor: AUTH_THEME.pageBg }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth/spheres-bg.png')" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_rgba(2,2,36,0.65)_100%)]"
      />

      <main className="relative z-10 flex min-h-svh items-center justify-center px-3 py-8 sm:px-5 sm:py-10 md:px-6 md:py-12">
        {children}
      </main>
    </div>
  );
}
