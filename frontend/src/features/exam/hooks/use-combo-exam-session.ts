"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listExamSettings, listExamSubjects } from "../api";
import {
  clearComboSession,
  loadComboSession,
  saveComboResult,
  saveComboSession,
} from "../lib/storage";
import type { ComboSubjectResult, ExamMode, StoredComboResult, StoredExamResult } from "../types";
import { useExamSession } from "./use-exam-session";

type ComboSubject = { code: string; name: string };

type UseComboExamSessionResult = ReturnType<typeof useExamSession> & {
  comboSubjects: ComboSubject[];
  /** index ของหมวดที่กำลังทำอยู่ตอนนี้ */
  comboIndex: number;
  /** ผลของหมวดที่ทำเสร็จแล้ว (ไม่รวมหมวดปัจจุบัน) */
  comboResults: ComboSubjectResult[];
  isLastSubject: boolean;
  nextSubjectName: string | null;
  comboError: string | null;
  /** สรุปผลรวมทุกหมวด — มีค่าเมื่อทำครบทุกหมวดแล้วเท่านั้น */
  comboFinalSummary: StoredComboResult | null;
  /** เริ่มสอบทุกหมวดหมู่ที่เปิดใช้งานอยู่ทั้งหมด ต่อกันไปเรื่อย ๆ */
  startCombo: (mode: ExamMode) => Promise<boolean>;
  /** ไปหมวดถัดไป หรือสรุปผลรวมถ้าเป็นหมวดสุดท้ายแล้ว — คืนค่า false ถ้าไปหมวดถัดไปไม่สำเร็จ */
  continueCombo: () => Promise<boolean>;
};

function toComboResult(result: StoredExamResult): ComboSubjectResult {
  return {
    subjectCode: result.subject,
    subjectName: result.subjectName,
    score: result.score,
    max_score: result.max_score,
    question_count: result.question_count,
    answered_count: result.answered_count,
  };
}

/**
 * Orchestrate การสอบ "ทุกหมวดหมู่พร้อมกัน" โดยเรียก startExam/submitExam ทีละหมวดต่อกันไป
 * (client-side orchestration — ไม่ต้องแก้ backend schema) แล้วรวมคะแนนเป็นค่าเฉลี่ยถ่วงน้ำหนัก
 * ตามจำนวนข้อของแต่ละหมวดตอนจบ
 */
export function useComboExamSession(): UseComboExamSessionResult {
  const base = useExamSession();

  const [comboSubjects, setComboSubjects] = useState<ComboSubject[]>([]);
  const [comboIndex, setComboIndex] = useState(0);
  const [comboResults, setComboResults] = useState<ComboSubjectResult[]>([]);
  const [comboError, setComboError] = useState<string | null>(null);
  const [comboFinalSummary, setComboFinalSummary] = useState<StoredComboResult | null>(null);

  const comboSubjectsRef = useRef<ComboSubject[]>([]);
  const comboIndexRef = useRef(0);
  const comboResultsRef = useRef<ComboSubjectResult[]>([]);
  const comboModeRef = useRef<ExamMode>("mock");

  // กู้คืน combo state ตอน refresh หน้ากลางทาง (คู่กับ active session ของหมวดปัจจุบันที่ base hook กู้คืนเองอยู่แล้ว)
  useEffect(() => {
    const saved = loadComboSession();
    if (!saved) return;
    comboSubjectsRef.current = saved.subjects;
    comboIndexRef.current = saved.currentIndex;
    comboResultsRef.current = saved.results;
    comboModeRef.current = saved.mode;
    setComboSubjects(saved.subjects);
    setComboIndex(saved.currentIndex);
    setComboResults(saved.results);
  }, []);

  const persist = useCallback(
    (subjects: ComboSubject[], mode: ExamMode, index: number, results: ComboSubjectResult[]) => {
      saveComboSession({ mode, subjects, currentIndex: index, results });
    },
    []
  );

  const startCombo = useCallback(
    async (mode: ExamMode): Promise<boolean> => {
      setComboError(null);
      try {
        const [subjects, settings] = await Promise.all([listExamSubjects(), listExamSettings()]);
        const enabledCodes = new Set(
          settings.filter((s) => s.mode === mode && s.is_enabled).map((s) => s.subject)
        );
        const eligible = subjects
          .filter((s) => s.is_active && enabledCodes.has(s.code))
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((s) => ({ code: s.code, name: s.name }));

        if (eligible.length === 0) {
          setComboError("ยังไม่มีกลุ่มข้อสอบที่เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ");
          return false;
        }

        comboSubjectsRef.current = eligible;
        comboIndexRef.current = 0;
        comboResultsRef.current = [];
        comboModeRef.current = mode;
        setComboSubjects(eligible);
        setComboIndex(0);
        setComboResults([]);
        setComboFinalSummary(null);
        persist(eligible, mode, 0, []);

        return await base.start({
          subject: eligible[0].code,
          subjectName: eligible[0].name,
          mode,
        });
      } catch {
        setComboError("เริ่มทำข้อสอบไม่สำเร็จ กรุณาลองใหม่");
        return false;
      }
    },
    [base, persist]
  );

  const submit = useCallback(async () => {
    const result = await base.submit();
    if (result) {
      const nextResults = [...comboResultsRef.current, toComboResult(result)];
      comboResultsRef.current = nextResults;
      setComboResults(nextResults);
      persist(comboSubjectsRef.current, comboModeRef.current, comboIndexRef.current, nextResults);
    }
    return result;
  }, [base, persist]);

  const continueCombo = useCallback(async (): Promise<boolean> => {
    const subjects = comboSubjectsRef.current;
    const nextIndex = comboIndexRef.current + 1;

    if (nextIndex < subjects.length) {
      const nextSubject = subjects[nextIndex];
      const ok = await base.start({
        subject: nextSubject.code,
        subjectName: nextSubject.name,
        mode: comboModeRef.current,
      });
      if (!ok) return false;
      comboIndexRef.current = nextIndex;
      setComboIndex(nextIndex);
      persist(subjects, comboModeRef.current, nextIndex, comboResultsRef.current);
      return true;
    }

    const results = comboResultsRef.current;
    const totalScore = results.reduce((sum, r) => sum + (r.score ?? 0), 0);
    const totalMaxScore = results.reduce((sum, r) => sum + (r.max_score ?? 0), 0);
    const summary: StoredComboResult = {
      mode: comboModeRef.current,
      results,
      totalScore,
      totalMaxScore,
      averagePercent: totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : null,
    };
    saveComboResult(summary);
    clearComboSession();
    setComboFinalSummary(summary);
    return true;
  }, [base, persist]);

  const isLastSubject = comboIndex >= comboSubjects.length - 1;
  const nextSubjectName = isLastSubject ? null : comboSubjects[comboIndex + 1]?.name ?? null;

  return {
    ...base,
    submit,
    comboSubjects,
    comboIndex,
    comboResults,
    isLastSubject,
    nextSubjectName,
    comboError,
    comboFinalSummary,
    startCombo,
    continueCombo,
  };
}
