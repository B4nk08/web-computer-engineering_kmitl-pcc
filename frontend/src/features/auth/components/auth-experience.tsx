"use client";

import { usePathname } from "next/navigation";
import type { AuthMode } from "../types";
import { AuthShell } from "./auth-shell";
import { AuthSplitCard } from "./auth-split-card";

function modeFromPath(pathname: string | null): AuthMode {
  return pathname?.startsWith("/register") ? "register" : "login";
}

/** คง shell ไว้ตอนสลับ /login ↔ /register เพื่อให้ animate ได้ */
export function AuthExperience() {
  const pathname = usePathname();
  const mode = modeFromPath(pathname);

  return (
    <AuthShell>
      <AuthSplitCard mode={mode} />
    </AuthShell>
  );
}
