import { AUTH_COPY } from "../constants";
import { cn } from "@/lib/utils";

export function AuthWelcomePanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col items-center justify-center px-5 py-6 text-center text-white sm:px-8 sm:py-8 lg:px-10",
        className
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem] lg:text-[2rem]">
        {AUTH_COPY.loginWelcomeTitle}
      </h2>
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-white/85 sm:mt-3 sm:max-w-[20rem] sm:text-[0.95rem]">
        {AUTH_COPY.loginWelcomeSubtitle}
      </p>
    </div>
  );
}
