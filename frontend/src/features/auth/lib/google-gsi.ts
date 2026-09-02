import { AUTH_ENV } from "../config/env";

export type GoogleCredentialResponse = {
  credential: string;
  select_by?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
            use_fedcm_for_button?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
              locale?: string;
            }
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "google-gsi-client";

let scriptPromise: Promise<void> | null = null;
let gisInitialized = false;
let credentialHandler: ((idToken: string) => void) | null = null;

/** โหลด Google Identity Services script ครั้งเดียว */
export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In ใช้ได้เฉพาะในเบราว์เซอร์"));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("โหลด Google Sign-In ไม่สำเร็จ")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("โหลด Google Sign-In ไม่สำเร็จ"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function requireGoogleClientId(): string {
  if (!AUTH_ENV.googleClientId) {
    throw new Error("ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_CLIENT_ID ใน .env");
  }
  return AUTH_ENV.googleClientId;
}

export function currentOriginHint(): string {
  if (typeof window === "undefined") return "http://localhost:3000";
  return window.location.origin;
}

export function originNotAllowedMessage(): string {
  const origin = currentOriginHint();
  return `Google ปฏิเสธ origin นี้ — ไปที่ Google Cloud Console → Credentials → OAuth 2.0 Client → Authorized JavaScript origins แล้วเพิ่ม: ${origin}`;
}

/** ตั้ง handler รับ id_token (เปลี่ยนได้ตอนสลับ login/register) */
export function setGoogleCredentialHandler(
  handler: ((idToken: string) => void) | null
) {
  credentialHandler = handler;
}

/** initialize GIS ครั้งเดียวทั้งแอป */
export async function ensureGoogleInitialized(): Promise<void> {
  const clientId = requireGoogleClientId();
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Sign-In ยังไม่พร้อม");
  }

  if (gisInitialized) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (!response.credential) return;
      credentialHandler?.(response.credential);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    // FedCM ยังมีปัญหา origin/cooldown บ่อยใน local — ใช้ปุ่มแบบคลาสสิกก่อน
    use_fedcm_for_prompt: false,
    use_fedcm_for_button: false,
  });
  gisInitialized = true;
}

/**
 * เรนเดอร์ปุ่ม Google ลง container (เรียก initialize แค่ครั้งแรกของแอป)
 */
export async function mountGoogleSignInButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
  options?: {
    text?: "signin_with" | "signup_with" | "continue_with";
    width?: number;
  }
): Promise<void> {
  setGoogleCredentialHandler(onCredential);
  await ensureGoogleInitialized();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Sign-In ยังไม่พร้อม");
  }

  container.innerHTML = "";
  window.google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: options?.text ?? "signin_with",
    shape: "pill",
    logo_alignment: "left",
    width: options?.width ?? 280,
    locale: "en",
  });
}
