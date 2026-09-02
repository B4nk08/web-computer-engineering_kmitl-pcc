"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { startExam, submitExam } from "../api";
import {
  clearActiveExamSession,
  loadActiveExamSession,
  saveExamResult,
  saveExamSession,
} from "../lib/storage";
import { QUESTIONS_PER_PAGE } from "../constants";
import type { ExamMode, StartExamInput, StoredExamResult, StoredExamSession } from "../types";

type UseExamSessionResult = {
  session: StoredExamSession | null;
  loading: boolean;
  starting: boolean;
  submitting: boolean;
  /** true หลังส่งคำตอบสำเร็จ — นาฬิกาหยุดแล้ว */
  submitted: boolean;
  error: string | null;
  remainingSeconds: number | null;
  elapsedSeconds: number;
  totalPages: number;
  start: (input: StartExamInput & { subjectName: string }) => Promise<boolean>;
  answer: (questionId: string, choiceKey: string) => void;
  toggleFlag: (questionId: string) => void;
  goToPage: (page: number) => void;
  goToQuestion: (questionId: string) => void;
  setStep: (step: "taking" | "review") => void;
  submit: () => Promise<StoredExamResult | null>;
  abandon: () => void;
  clearError: () => void;
};

export function useExamSession(): UseExamSessionResult {
  const [session, setSession] = useState<StoredExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const submittedRef = useRef(false);
  /** ค่าเวลาที่ freeze ตอนเริ่มส่ง / ส่งสำเร็จ */
  const frozenRemainingRef = useRef<number | null>(null);
  const frozenElapsedRef = useRef(0);

  useEffect(() => {
    setSession(loadActiveExamSession());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session || submittedRef.current) return;
    saveExamSession(session);
  }, [session]);

  // หยุดนับเวลาทันทีเมื่อกำลังส่งหรือส่งแล้ว
  useEffect(() => {
    if (submitting || submitted) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [submitting, submitted]);

  const liveRemaining = useMemo(() => {
    if (!session || !session.timeLimitMinutes || !session.startedAt) return null;
    const deadline = new Date(session.startedAt).getTime() + session.timeLimitMinutes * 60_000;
    return Math.max(0, Math.floor((deadline - now) / 1000));
  }, [session, now]);

  const liveElapsed = useMemo(() => {
    if (!session?.startedAt) return 0;
    return Math.max(0, Math.floor((now - new Date(session.startedAt).getTime()) / 1000));
  }, [session, now]);

  const remainingSeconds =
    submitting || submitted ? frozenRemainingRef.current : liveRemaining;
  const elapsedSeconds =
    submitting || submitted ? frozenElapsedRef.current : liveElapsed;

  const totalPages = useMemo(() => {
    if (!session) return 0;
    return Math.max(1, Math.ceil(session.questions.length / QUESTIONS_PER_PAGE));
  }, [session]);

  const start = useCallback(
    async (input: StartExamInput & { subjectName: string }): Promise<boolean> => {
      setStarting(true);
      setError(null);
      try {
        const res = await startExam(input);
        const next: StoredExamSession = {
          attemptId: res.attempt_id,
          subjectCode: res.subject,
          subjectName: input.subjectName,
          mode: (res.mode as ExamMode) ?? input.mode,
          timeLimitMinutes: res.time_limit_minutes ?? null,
          startedAt: res.started_at ?? new Date().toISOString(),
          questions: res.questions,
          answers: {},
          flagged: [],
          step: "taking",
          currentPage: 0,
        };
        saveExamSession(next);
        submittedRef.current = false;
        frozenRemainingRef.current = null;
        frozenElapsedRef.current = 0;
        setSubmitted(false);
        setSession(next);
        setNow(Date.now());
        return true;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "เริ่มทำข้อสอบไม่สำเร็จ กรุณาลองใหม่");
        return false;
      } finally {
        setStarting(false);
      }
    },
    []
  );

  const answer = useCallback((questionId: string, choiceKey: string) => {
    setSession((prev) => {
      if (!prev || submittedRef.current) return prev;
      return { ...prev, answers: { ...prev.answers, [questionId]: choiceKey } };
    });
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setSession((prev) => {
      if (!prev || submittedRef.current) return prev;
      const flagged = prev.flagged.includes(questionId)
        ? prev.flagged.filter((id) => id !== questionId)
        : [...prev.flagged, questionId];
      return { ...prev, flagged };
    });
  }, []);

  const goToPage = useCallback((page: number) => {
    setSession((prev) => {
      if (!prev || submittedRef.current) return prev;
      const maxPage = Math.max(0, Math.ceil(prev.questions.length / QUESTIONS_PER_PAGE) - 1);
      const clamped = Math.min(Math.max(0, page), maxPage);
      return { ...prev, currentPage: clamped };
    });
  }, []);

  const goToQuestion = useCallback((questionId: string) => {
    setSession((prev) => {
      if (!prev || submittedRef.current) return prev;
      const idx = prev.questions.findIndex((q) => q.id === questionId);
      if (idx === -1) return prev;
      return { ...prev, currentPage: Math.floor(idx / QUESTIONS_PER_PAGE), step: "taking" };
    });
  }, []);

  const setStep = useCallback((step: "taking" | "review") => {
    setSession((prev) => {
      if (!prev || submittedRef.current) return prev;
      return { ...prev, step };
    });
  }, []);

  const submit = useCallback(async (): Promise<StoredExamResult | null> => {
    if (!session || submittedRef.current) return null;

    // freeze นาฬิกาก่อนยิง API
    frozenRemainingRef.current = liveRemaining;
    frozenElapsedRef.current = liveElapsed;
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitExam(session.attemptId, session.answers);
      const score = toNumberOrNull(result.score);
      const maxScore = toNumberOrNull(result.max_score);
      const stored: StoredExamResult = {
        ...result,
        score,
        max_score: maxScore,
        subjectName: session.subjectName,
        answered_count: Object.keys(session.answers).length,
        question_count: session.questions.length,
      };
      saveExamResult(stored);
      // ลบ session ใน localStorage กัน resume — แต่ยังเก็บใน memory
      // เพื่อให้ popup ผลคะแนนยังโชว์อยู่บนหน้าเดิมได้
      submittedRef.current = true;
      setSubmitted(true);
      clearActiveExamSession();
      return stored;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ส่งคำตอบไม่สำเร็จ กรุณาลองใหม่");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [session, liveRemaining, liveElapsed]);

  const abandon = useCallback(() => {
    clearActiveExamSession();
    setSession(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    session,
    loading,
    starting,
    submitting,
    submitted,
    error,
    remainingSeconds,
    elapsedSeconds,
    totalPages,
    start,
    answer,
    toggleFlag,
    goToPage,
    goToQuestion,
    setStep,
    submit,
    abandon,
    clearError,
  };
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}
