import type {
  StoredComboResult,
  StoredComboSession,
  StoredExamResult,
  StoredExamSession,
} from "../types";

/**
 * เก็บ session ลง localStorage (ไม่ใช่ sessionStorage) เพื่อกันข้อมูลหาย
 * ถ้า user refresh หน้าหรือเผลอกดปิด tab แล้วเปิดใหม่ระหว่างทำข้อสอบ
 */
const ACTIVE_ATTEMPT_KEY = "ce_exam_active_attempt_id";
const SESSION_PREFIX = "ce_exam_session:";
const RESULT_KEY = "ce_exam_last_result";
const COMBO_SESSION_KEY = "ce_exam_combo_session";
const COMBO_RESULT_KEY = "ce_exam_combo_result";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveExamSession(session: StoredExamSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACTIVE_ATTEMPT_KEY, session.attemptId);
  window.localStorage.setItem(SESSION_PREFIX + session.attemptId, JSON.stringify(session));
}

export function loadActiveExamSession(): StoredExamSession | null {
  if (!isBrowser()) return null;
  const attemptId = window.localStorage.getItem(ACTIVE_ATTEMPT_KEY);
  if (!attemptId) return null;
  const raw = window.localStorage.getItem(SESSION_PREFIX + attemptId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredExamSession;
  } catch {
    return null;
  }
}

export function clearActiveExamSession() {
  if (!isBrowser()) return;
  const attemptId = window.localStorage.getItem(ACTIVE_ATTEMPT_KEY);
  if (attemptId) {
    window.localStorage.removeItem(SESSION_PREFIX + attemptId);
  }
  window.localStorage.removeItem(ACTIVE_ATTEMPT_KEY);
}

export function saveExamResult(result: StoredExamResult) {
  if (!isBrowser()) return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadExamResult(): StoredExamResult | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredExamResult;
    return {
      ...parsed,
      score: toNumberOrNull(parsed.score),
      max_score: toNumberOrNull(parsed.max_score),
    };
  } catch {
    return null;
  }
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function clearExamResult() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(RESULT_KEY);
}

/** ---------- Combo (สอบทุกหมวดหมู่พร้อมกัน) ---------- */

export function saveComboSession(state: StoredComboSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(COMBO_SESSION_KEY, JSON.stringify(state));
}

export function loadComboSession(): StoredComboSession | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(COMBO_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredComboSession;
  } catch {
    return null;
  }
}

export function clearComboSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(COMBO_SESSION_KEY);
}

export function saveComboResult(result: StoredComboResult) {
  if (!isBrowser()) return;
  window.localStorage.setItem(COMBO_RESULT_KEY, JSON.stringify(result));
}

export function loadComboResult(): StoredComboResult | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(COMBO_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredComboResult;
  } catch {
    return null;
  }
}

export function clearComboResult() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(COMBO_RESULT_KEY);
}
