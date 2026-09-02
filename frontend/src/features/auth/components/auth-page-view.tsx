import type { AuthMode } from "../types";
import { AuthShell } from "./auth-shell";
import { AuthSplitCard } from "./auth-split-card";

type AuthPageViewProps = {
  mode: AuthMode;
};

/** ใช้เมื่อต้องการ render auth UI นอก (auth) layout */
export function AuthPageView({ mode }: AuthPageViewProps) {
  return (
    <AuthShell>
      <AuthSplitCard mode={mode} />
    </AuthShell>
  );
}
