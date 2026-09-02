import { AUTH_COPY } from "../constants";
import { AuthModeToggle } from "./auth-mode-toggle";
import type { AuthMode } from "../types";
import { cn } from "@/lib/utils";

type AuthWelcomePanelProps = {
  mode: AuthMode;
  className?: string;
};

export function AuthWelcomePanel({ mode, className }: AuthWelcomePanelProps) {
  const isLogin = mode === "login";
  const title = isLogin
    ? AUTH_COPY.loginWelcomeTitle
    : AUTH_COPY.registerWelcomeTitle;
  const subtitle = isLogin
    ? AUTH_COPY.loginWelcomeSubtitle
    : AUTH_COPY.registerWelcomeSubtitle;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col px-5 py-6 text-white sm:px-8 sm:py-8 md:px-8 md:py-8 lg:px-10",
        className
      )}
    >
      <div className="flex justify-end">
        <AuthModeToggle mode={mode} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-2 text-center sm:px-4">
        <div key={mode} className="transition-opacity duration-500">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem] lg:text-[2rem]">
            {title}
          </h2>
          <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-white/85 sm:mt-3 sm:max-w-[16rem] sm:text-[0.95rem]">
            {subtitle}
          </p>
        </div>
      </div>

      <div aria-hidden className="h-6 sm:h-8" />
    </div>
  );
}
