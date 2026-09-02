"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  deleteExamQuestion,
  listExamQuestions,
  listExamSettings,
  listExamSubjects,
  upsertExamSetting,
} from "../../api";
import { getSubjectIcon } from "../../lib/subject-icon";
import type { ExamQuestionAdminDto, ExamSettingDto, ExamSubjectDto } from "../../types";
import { ExamQuestionAddButton, ExamQuestionFormDialog } from "./exam-question-form-dialog";
import { ExamSubjectCreateDialog } from "./exam-subject-create-dialog";

const ADMIN_MODE = "mock" as const;

export function ExamAdminManager() {
  const [subjects, setSubjects] = useState<ExamSubjectDto[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionAdminDto[]>([]);
  const [settings, setSettings] = useState<ExamSettingDto[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ExamQuestionAdminDto | null>(null);

  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(90);
  const [isEnabled, setIsEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  const loadSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    setError(null);
    try {
      const [subj, sett] = await Promise.all([
        listExamSubjects(true),
        listExamSettings(),
      ]);
      setSubjects(subj);
      setSettings(sett);
      setSelectedCode((prev) => {
        if (prev && subj.some((s) => s.code === prev)) return prev;
        return subj.find((s) => s.is_active)?.code ?? subj[0]?.code ?? null;
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "โหลดกลุ่มข้อสอบไม่สำเร็จ"
      );
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  const loadQuestions = useCallback(async (subject: string) => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const items = await listExamQuestions({ subject, mode: ADMIN_MODE });
      setQuestions(items);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "โหลดข้อสอบไม่สำเร็จ"
      );
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    void loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    if (!selectedCode) {
      setQuestions([]);
      return;
    }
    void loadQuestions(selectedCode);
  }, [selectedCode, loadQuestions]);

  useEffect(() => {
    if (!selectedCode) return;
    const setting = settings.find(
      (s) => s.subject === selectedCode && s.mode === ADMIN_MODE
    );
    if (setting) {
      setQuestionCount(setting.question_count);
      setTimeLimit(setting.time_limit_minutes ?? 90);
      setIsEnabled(setting.is_enabled);
    } else {
      setQuestionCount(10);
      setTimeLimit(90);
      setIsEnabled(true);
    }
  }, [selectedCode, settings]);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.code === selectedCode) ?? null,
    [subjects, selectedCode]
  );

  const hasSetting = useMemo(
    () =>
      Boolean(
        selectedCode &&
          settings.some((s) => s.subject === selectedCode && s.mode === ADMIN_MODE)
      ),
    [selectedCode, settings]
  );

  async function handleSaveSettings() {
    if (!selectedCode) return;
    setSavingSettings(true);
    setError(null);
    try {
      const saved = await upsertExamSetting({
        subject: selectedCode,
        mode: ADMIN_MODE,
        question_count: questionCount,
        time_limit_minutes: timeLimit > 0 ? timeLimit : null,
        is_enabled: isEnabled,
      });
      setSettings((prev) => {
        const others = prev.filter(
          (s) => !(s.subject === saved.subject && s.mode === saved.mode)
        );
        return [...others, saved];
      });
      flash("บันทึกการตั้งค่าสอบแล้ว");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "บันทึกการตั้งค่าไม่สำเร็จ"
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleDelete(q: ExamQuestionAdminDto) {
    if (!window.confirm(`ลบข้อสอบนี้?\n\n${q.prompt.slice(0, 80)}`)) return;
    try {
      await deleteExamQuestion(q.id);
      flash("ลบข้อสอบแล้ว");
      if (selectedCode) void loadQuestions(selectedCode);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "ลบข้อสอบไม่สำเร็จ"
      );
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Exit Exam
          </h2>
          <p className="text-sm text-muted-foreground">
            เลือกกลุ่มข้อสอบ แล้วเพิ่ม/แก้ไขคำถามผ่านระบบ (โหมด Mock)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExamSubjectCreateDialog
            onCreated={() => {
              flash("เพิ่มกลุ่มข้อสอบแล้ว");
              void loadSubjects();
            }}
          />
          <ExamQuestionAddButton
            disabled={!selectedCode}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          />
        </div>
      </header>

      {notice ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {notice}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      {/* Subject selector */}
      <section className="space-y-3">
        <p className="text-sm font-medium text-foreground">กลุ่มข้อสอบ</p>
        {loadingSubjects ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            กำลังโหลดกลุ่ม...
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            ยังไม่มีกลุ่มข้อสอบ — กด &quot;เพิ่มกลุ่ม&quot; เพื่อสร้าง เช่น software, iot
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const Icon = getSubjectIcon(subject.code);
              const active = subject.code === selectedCode;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedCode(subject.code)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted",
                    !subject.is_active && "opacity-50"
                  )}
                >
                  <Icon className="size-4" />
                  {subject.name}
                  {!subject.is_active ? (
                    <span className="text-xs opacity-80">(ปิด)</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedSubject ? (
        <>
          {/* Settings */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  การตั้งค่าสอบ — {selectedSubject.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ต้องบันทึกการตั้งค่าก่อน นักศึกษาถึงจะเริ่มสอบกลุ่มนี้ได้
                  {!hasSetting ? (
                    <span className="ml-1 font-medium text-amber-700">
                      (ยังไม่ได้ตั้งค่า)
                    </span>
                  ) : null}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => void handleSaveSettings()}
                disabled={savingSettings}
              >
                {savingSettings ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                บันทึกการตั้งค่า
              </Button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="exam-qcount">จำนวนข้อที่สุ่มออกมา</Label>
                <Input
                  id="exam-qcount"
                  type="number"
                  min={1}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-timelimit">เวลาจำกัด (นาที)</Label>
                <Input
                  id="exam-timelimit"
                  type="number"
                  min={1}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>สถานะ</Label>
                <label className="flex h-9 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                  />
                  เปิดให้นักศึกษาสอบได้
                </label>
              </div>
            </div>
          </section>

          {/* Question list */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                คลังข้อสอบ ({questions.length} ข้อ)
              </h3>
            </div>

            {loadingQuestions ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                กำลังโหลดข้อสอบ...
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">ยังไม่มีข้อสอบในกลุ่มนี้</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  กด &quot;เพิ่มข้อสอบ&quot; เพื่อใส่โจทย์และตัวเลือก ก–ง
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {questions.map((q, idx) => {
                  const correct = q.choices.find((c) => c.is_correct);
                  return (
                    <li
                      key={q.id}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                              {idx + 1}
                            </span>
                            {!q.is_active ? (
                              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                                ปิดใช้งาน
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {q.prompt}
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {q.choices.map((c) => (
                              <li
                                key={c.key}
                                className={cn(
                                  c.is_correct && "font-medium text-emerald-700"
                                )}
                              >
                                <span className="mr-1 uppercase">{c.key}.</span>
                                {c.text}
                                {c.is_correct ? " ✓" : ""}
                              </li>
                            ))}
                          </ul>
                          {correct ? null : (
                            <p className="mt-1 text-xs text-red-600">
                              ยังไม่ได้ตั้งคำตอบที่ถูก
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="แก้ไข"
                            onClick={() => {
                              setEditing(q);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="ลบ"
                            onClick={() => void handleDelete(q)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      ) : null}

      {selectedCode ? (
        <ExamQuestionFormDialog
          subjectCode={selectedCode}
          question={editing}
          open={formOpen}
          onOpenChange={setFormOpen}
          onSaved={() => {
            flash(editing ? "แก้ไขข้อสอบแล้ว" : "เพิ่มข้อสอบแล้ว");
            if (selectedCode) void loadQuestions(selectedCode);
          }}
        />
      ) : null}
    </div>
  );
}
