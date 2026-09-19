"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Save, Trash2 } from "lucide-react";
import {
  AdminBadge,
  AdminCheckbox,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminPageFrame,
  AdminPill,
  AdminSection,
  AdminSelectionBar,
  AdminStatus,
  AdminToggle,
  deleteConfirmCopy,
  deleteMany,
  useAdminSelection,
  type PendingDelete,
} from "@/components/admin";
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
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);

  const questionIds = useMemo(() => questions.map((item) => item.id), [questions]);
  const selection = useAdminSelection(questionIds);

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

  async function handleConfirmDelete() {
    if (!pendingDelete?.ids.length) return;
    setDeleting(true);
    try {
      const result = await deleteMany(pendingDelete.ids, deleteExamQuestion);
      selection.clear();
      setPendingDelete(null);
      if (selectedCode) await loadQuestions(selectedCode);
      if (result.failed > 0) {
        setError(result.message ?? "ลบบางข้อสอบไม่สำเร็จ");
      } else {
        flash(result.ok > 1 ? `ลบ ${result.ok} ข้อแล้ว` : "ลบข้อสอบแล้ว");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
    <AdminPageFrame
      title="Exit Exam"
      description="เลือกกลุ่มข้อสอบ แล้วเพิ่ม/แก้ไขคำถามผ่านระบบ (โหมด Mock)"
      bodyClassName="space-y-6"
      actions={
        <>
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
        </>
      }
    >
      {notice ? <AdminStatus tone="success">{notice}</AdminStatus> : null}
      {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

      <AdminSection title="กลุ่มข้อสอบ">
        {loadingSubjects ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            กำลังโหลดกลุ่ม...
          </div>
        ) : subjects.length === 0 ? (
          <AdminEmptyState
            title="ยังไม่มีกลุ่มข้อสอบ"
            description='กด "เพิ่มกลุ่ม" เพื่อสร้าง เช่น software, iot'
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const Icon = getSubjectIcon(subject.code);
              return (
                <AdminPill
                  key={subject.id}
                  active={subject.code === selectedCode}
                  muted={!subject.is_active}
                  onClick={() => setSelectedCode(subject.code)}
                >
                  <Icon className="size-4" />
                  {subject.name}
                  {!subject.is_active ? <span className="text-xs opacity-80">(ปิด)</span> : null}
                </AdminPill>
              );
            })}
          </div>
        )}
      </AdminSection>

      {selectedSubject ? (
        <>
          <AdminSection
            title={`การตั้งค่าสอบ — ${selectedSubject.name}`}
            description={
              hasSetting
                ? "ต้องบันทึกการตั้งค่าก่อน นักศึกษาถึงจะเริ่มสอบกลุ่มนี้ได้"
                : "ต้องบันทึกการตั้งค่าก่อน นักศึกษาถึงจะเริ่มสอบกลุ่มนี้ได้ (ยังไม่ได้ตั้งค่า)"
            }
          >
            <div className="grid gap-4 sm:grid-cols-3">
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
                <AdminToggle
                  checked={isEnabled}
                  onChange={setIsEnabled}
                  label="เปิดให้นักศึกษาสอบได้"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => void handleSaveSettings()} disabled={savingSettings}>
                {savingSettings ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                บันทึกการตั้งค่า
              </Button>
            </div>
          </AdminSection>

          <AdminSection title={`คลังข้อสอบ (${questions.length} ข้อ)`}>
            {loadingQuestions ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                กำลังโหลดข้อสอบ...
              </div>
            ) : questions.length === 0 ? (
              <AdminEmptyState
                title="ยังไม่มีข้อสอบในกลุ่มนี้"
                description='กด "เพิ่มข้อสอบ" เพื่อใส่โจทย์และตัวเลือก ก–ง'
              />
            ) : (
              <>
              <AdminSelectionBar
                total={questions.length}
                selectedCount={selection.count}
                allSelected={selection.allSelected}
                someSelected={selection.someSelected}
                onToggleAll={selection.setAll}
                onDeleteSelected={() =>
                  setPendingDelete({
                    ids: selection.selectedIds,
                    label: `${selection.count} ข้อที่เลือก`,
                  })
                }
                deleting={deleting}
              />
              <ul className="space-y-3">
                {questions.map((q, idx) => {
                  const correct = q.choices.find((c) => c.is_correct);
                  return (
                    <li
                      key={q.id}
                      className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <AdminCheckbox
                          className="mt-1.5"
                          checked={selection.selected.has(q.id)}
                          onCheckedChange={() => selection.toggle(q.id)}
                          disabled={deleting}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#d4652b] text-xs font-semibold text-white">
                              {idx + 1}
                            </span>
                            {!q.is_active ? <AdminBadge tone="warning">ปิดใช้งาน</AdminBadge> : null}
                          </div>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                            {q.prompt}
                          </p>
                          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                            {q.choices.map((c) => (
                              <li
                                key={c.key}
                                className={cn(
                                  "flex items-start gap-2",
                                  c.is_correct && "font-medium text-emerald-700"
                                )}
                              >
                                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold uppercase text-foreground">
                                  {c.key}
                                </span>
                                <span>{c.text}{c.is_correct ? " ✓" : ""}</span>
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
                            disabled={deleting}
                            onClick={() =>
                              setPendingDelete({
                                ids: [q.id],
                                label: q.prompt.slice(0, 80) || "ข้อนี้",
                              })
                            }
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </>
            )}
          </AdminSection>
        </>
      ) : null}

    </AdminPageFrame>
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

      <AdminConfirmDialog
        open={pendingDelete != null}
        title={deleteConfirmCopy(pendingDelete).title}
        description={deleteConfirmCopy(pendingDelete).description}
        confirming={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      />
    </>
  );
}
