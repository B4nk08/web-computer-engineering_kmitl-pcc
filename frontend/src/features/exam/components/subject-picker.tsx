"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, GraduationCap, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { listExamSettings, listExamSubjects } from "../api";
import { useComboExamSession } from "../hooks/use-combo-exam-session";
import { getSubjectIcon } from "../lib/subject-icon";
import { loadActiveExamSession } from "../lib/storage";
import type { ExamSettingDto, ExamSubjectDto } from "../types";
import { ResumeBanner } from "./resume-banner";

export function SubjectPicker() {
  const router = useRouter();
  const { user } = useAuth();
  const { startCombo, starting, error, comboError, clearError } = useComboExamSession();

  const [subjects, setSubjects] = useState<ExamSubjectDto[]>([]);
  const [settings, setSettings] = useState<ExamSettingDto[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    setHasActiveSession(Boolean(loadActiveExamSession()));
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.all([listExamSubjects(), listExamSettings()])
      .then(([subjectItems, settingItems]) => {
        if (!mounted) return;
        setSubjects(subjectItems);
        setSettings(settingItems);
      })
      .catch(() => {
        if (!mounted) return;
        setSubjectsError("โหลดรายการกลุ่มข้อสอบไม่สำเร็จ ลองรีเฟรชหน้าใหม่");
      })
      .finally(() => {
        if (mounted) setSubjectsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const settingBySubject = useMemo(() => {
    const map = new Map<string, ExamSettingDto>();
    for (const s of settings) {
      if (s.mode === "mock") map.set(s.subject, s);
    }
    return map;
  }, [settings]);

  const eligibleSubjects = useMemo(
    () =>
      subjects
        .filter((s) => s.is_active && settingBySubject.get(s.code)?.is_enabled)
        .sort((a, b) => a.sort_order - b.sort_order),
    [subjects, settingBySubject]
  );

  const totalQuestions = useMemo(
    () =>
      eligibleSubjects.reduce(
        (sum, s) => sum + (settingBySubject.get(s.code)?.question_count ?? 0),
        0
      ),
    [eligibleSubjects, settingBySubject]
  );

  const totalMinutes = useMemo(
    () =>
      eligibleSubjects.reduce(
        (sum, s) => sum + (settingBySubject.get(s.code)?.time_limit_minutes ?? 0),
        0
      ),
    [eligibleSubjects, settingBySubject]
  );

  const canStart = eligibleSubjects.length > 0;

  async function handleStart() {
    if (!canStart) return;
    clearError();
    const ok = await startCombo("mock");
    if (ok) {
      router.push("/exam/session");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[url('/exam/exam-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {hasActiveSession ? (
          <ResumeBanner onDismiss={() => setHasActiveSession(false)} />
        ) : null}

        <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10">
          <GraduationCap className="size-9 text-indigo-700" />
        </div>

        <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-indigo-950 md:text-4xl">
          Computer Engineering Exam System
        </h1>
        <p className="mt-2 text-center text-sm text-indigo-700/80 md:text-base">
          สอบวัดระดับทางวิศวกรรมคอมพิวเตอร์
        </p>
        {user ? (
          <p className="mt-1 text-center text-xs text-indigo-700/70">
            เข้าสู่ระบบเป็น {user.displayName || user.email}
          </p>
        ) : null}

        <div className="mt-10 w-full max-w-md rounded-3xl bg-indigo-950 p-6 shadow-2xl">
          <div className="rounded-2xl bg-white p-5 shadow-inner">
            <p className="text-sm font-medium text-slate-500">
              หมวดหมู่ที่ต้องสอบ (สอบครบทุกหมวดในรอบเดียว)
            </p>

            {subjectsLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
                <Loader2 className="size-4 animate-spin" />
                กำลังโหลด...
              </div>
            ) : subjectsError ? (
              <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {subjectsError}
              </p>
            ) : eligibleSubjects.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-400">
                ยังไม่มีกลุ่มข้อสอบที่เปิดใช้งาน
              </p>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {eligibleSubjects.map((subject) => {
                    const Icon = getSubjectIcon(subject.code);
                    return (
                      <div
                        key={subject.id}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-4 text-center text-indigo-700"
                      >
                        <div className="relative">
                          <Icon className="size-6 text-indigo-600" />
                          <CheckCircle2 className="absolute -right-2 -top-2 size-3.5 fill-emerald-500 text-white" />
                        </div>
                        <span className="text-sm font-medium">{subject.name}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-xs text-slate-500">
                  รวม {eligibleSubjects.length} หมวดหมู่
                  {totalQuestions > 0 ? ` · ${totalQuestions} ข้อ` : ""}
                  {totalMinutes > 0 ? ` · ประมาณ ${totalMinutes} นาที` : ""}
                </p>
              </>
            )}

            {error || comboError ? (
              <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {error || comboError}
              </p>
            ) : null}

            <Button
              type="button"
              size="lg"
              className="mt-5 w-full bg-indigo-950 hover:bg-indigo-900"
              disabled={!canStart || starting}
              onClick={handleStart}
            >
              {starting ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
              เริ่มทำข้อสอบทั้งหมด
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
