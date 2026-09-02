"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/api";
import { useAuth } from "../providers/auth-provider";

type JsonPayload = Record<string, unknown>;

export function GetTokenView() {
  const { user, loading: authLoading } = useAuth();
  const [payload, setPayload] = useState<JsonPayload | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const token = getAccessToken();
    if (token && user) {
      setPayload({
        success: true,
        message: "ใช้ token จาก session ปัจจุบัน (รวม Google OAuth)",
        data: {
          token,
          token_type: "Bearer",
          user: {
            id: user.id,
            email: user.email,
            display_name: user.displayName,
            avatar_url: user.avatarUrl,
            role: user.role,
          },
        },
      });
      return;
    }

    setPayload({
      success: false,
      message: "ไม่ได้ login",
      error:
        "ยังไม่มี session — ไป login ที่ /login แล้วกลับมาที่ /gettoken",
    });
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <main className="min-h-svh bg-white p-6 font-mono text-sm text-black">
        loading...
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-white p-6 font-mono text-sm text-black whitespace-pre-wrap break-all">
      {payload ? JSON.stringify(payload, null, 2) : null}
    </main>
  );
}
