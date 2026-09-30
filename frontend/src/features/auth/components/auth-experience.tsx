"use client";

import { AuthShell } from "./auth-shell";
import { AuthSplitCard } from "./auth-split-card";

export function AuthExperience() {
  return (
    <AuthShell>
      <AuthSplitCard />
    </AuthShell>
  );
}
