"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Minus, Plus, Search, Trash2 } from "lucide-react";
import {
  AdminCheckbox,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminPageFrame,
  AdminSelectionBar,
  AdminStatus,
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
import { generalQuizQuestions } from "../../data/general-quiz-questions";
import {
  addQuizQuestion,
  createQuiz,
  deleteQuizQuestion,
  getQuizAdmin,
  listCareerClusters,
  listQuizzes,
  updateQuiz,
} from "../../api";
import type {
  CareerClusterDto,
  QuizQuestionAdminDto,
  QuizSummaryDto,
} from "../../api";
import { QuizQuestionFormDialog } from "./quiz-question-form-dialog";

type QuizKind = "internal" | "external";

const KIND_META: Record<
  QuizKind,
  {
    label: string;
    title: string;
    description: string;
    createTitle: string;
    createDescription: string;
    audience: string;
    empty: string;
    publicHint: string;
  }
> = {
  internal: {
    label: "แนะนำสายงาน",
    title: "Quiz แนะนำสาย",
    description: "สำหรับนักศึกษาที่ล็อกอินแล้ว — แต่ละตัวเลือกผูกกับกลุ่มสายเพื่อคำนวณผล",
    createTitle: "แบบทดสอบแนะนำสายงาน",
    createDescription: "ค้นหาหัวข้อใหญ่ที่คุณเอียงไปทางไหนในสาขาวิศวกรรมคอมพิวเตอร์",
    audience: "เปิดให้นักศึกษาทำได้",
    empty: "ยังไม่มีควิซแนะนำสาย — กด \"สร้างควิซ\" แล้วค่อยเพิ่มคำถาม",
    publicHint: "หน้า /student/quiz-recommend",
  },
  external: {
    label: "วัดความพร้อม",
    title: "Quiz วัดความพร้อม",
    description: "สำหรับบุคคลทั่วไป — แต่ละตัวเลือกมีน้ำหนัก 0–3 เพื่อคิดเปอร์เซ็นต์ความพร้อม",
    createTitle: "แบบทดสอบวัดความพร้อม",
    createDescription: "สำรวจว่าพร้อมเข้าเรียนวิศวกรรมคอมพิวเตอร์แค่ไหน พร้อมคำแนะนำทักษะที่ควรเติม",
    audience: "เปิดให้บุคคลทั่วไปทำได้",
    empty: "ยังไม่มีควิซวัดความพร้อม — กด \"สร้างควิซ\" เพื่อเริ่มจากคำถามตัวอย่าง 20 ข้อ",
    publicHint: "หน้า /academics/quiz",
  },
};

const FALLBACK_CLUSTERS: CareerClusterDto[] = [
  { code: "software", name: "สร้างซอฟต์แวร์", name_en: "Software", description: "", image_url: "", sort_order: 1 },
  { code: "iot", name: "IoT และระบบฝังตัว", name_en: "IoT", description: "", image_url: "", sort_order: 2 },
  { code: "network", name: "เครือข่ายและความปลอดภัย", name_en: "Network", description: "", image_url: "", sort_order: 3 },
  { code: "data", name: "ข้อมูลและปัญญาประดิษฐ์", name_en: "Data", description: "", image_url: "", sort_order: 4 },
];

function clusterLabel(
  scoreMap: Record<string, number> | null | undefined,
  clusters: CareerClusterDto[]
): string {
  if (!scoreMap) return "ไม่ระบุกลุ่ม";
  const code = Object.entries(scoreMap)
    .filter(([key]) => key !== "readiness")
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
  if (!code) return "ไม่ระบุกลุ่ม";
  return clusters.find((item) => item.code === code)?.name ?? code;
}

function optionHint(
  kind: QuizKind,
  scoreMap: Record<string, number> | null | undefined,
  clusters: CareerClusterDto[]
): string {
  if (kind === "external") {
    const weight = typeof scoreMap?.readiness === "number" ? scoreMap.readiness : 0;
    return `น้ำหนัก ${weight}`;
  }
  return clusterLabel(scoreMap, clusters);
}

type QuizMeta = {
  title: string;
  description: string;
  questionCount: number;
  isActive: boolean;
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

function StatusSwitch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-emerald-500" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-white px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function QuizAdminManager({ kind }: { kind: QuizKind }) {
  const [quizzes, setQuizzes] = useState<QuizSummaryDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionAdminDto[]>([]);
  const [clusters, setClusters] = useState<CareerClusterDto[]>(FALLBACK_CLUSTERS);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<QuizQuestionAdminDto | null>(null);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savedMeta, setSavedMeta] = useState<QuizMeta | null>(null);
  const [query, setQuery] = useState("");

  const metaDirty =
    savedMeta != null &&
    (savedMeta.title !== title ||
      savedMeta.description !== description ||
      savedMeta.questionCount !== questionCount ||
      savedMeta.isActive !== isActive);

  const visibleQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const indexed = questions.map((question, index) => ({ question, index }));
    if (!q) return indexed;
    return indexed.filter(({ question }) =>
      [question.prompt, ...question.options.map((o) => o.label)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [questions, query]);

  const questionIds = useMemo(() => questions.map((item) => item.id), [questions]);
  const selection = useAdminSelection(questionIds);

  const meta = KIND_META[kind];

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  const loadQuizzes = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const [items, clusterRows] = await Promise.all([
        listQuizzes(kind),
        listCareerClusters().catch(() => FALLBACK_CLUSTERS),
      ]);
      setQuizzes(items);
      if (clusterRows.length > 0) setClusters(clusterRows);
      setSelectedId((prev) => {
        if (prev && items.some((item) => item.id === prev)) return prev;
        return items[0]?.id ?? null;
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดควิซไม่สำเร็จ");
    } finally {
      setLoadingList(false);
    }
  }, [kind]);

  const loadDetail = useCallback(async (id: string) => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const detail = await getQuizAdmin(id);
      setQuestions(detail.questions);
      setTitle(detail.quiz.title);
      setDescription(detail.quiz.description);
      setQuestionCount(detail.quiz.question_count ?? 0);
      setIsActive(detail.quiz.is_active);
      setSavedMeta({
        title: detail.quiz.title,
        description: detail.quiz.description,
        questionCount: detail.quiz.question_count ?? 0,
        isActive: detail.quiz.is_active,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "โหลดคำถามไม่สำเร็จ");
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    if (!selectedId) {
      setQuestions([]);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const selectedQuiz = useMemo(
    () => quizzes.find((item) => item.id === selectedId) ?? null,
    [quizzes, selectedId]
  );

  async function seedExternalQuestions(quizId: string) {
    for (let index = 0; index < generalQuizQuestions.length; index += 1) {
      const question = generalQuizQuestions[index];
      await addQuizQuestion(quizId, {
        prompt: question.text,
        sort_order: index + 1,
        options: question.choices.map((choice, order) => ({
          label: choice.text,
          score_map: { readiness: choice.weight ?? 0 },
          sort_order: order + 1,
        })),
      });
    }
  }

  async function handleCreateQuiz() {
    setCreatingQuiz(true);
    setError(null);
    try {
      const created = await createQuiz({
        kind,
        title: meta.createTitle,
        description: meta.createDescription,
        is_active: true,
      });
      if (kind === "external") {
        flash("กำลังนำเข้าคำถามตัวอย่าง...");
        await seedExternalQuestions(created.id);
      }
      flash(kind === "external" ? "สร้างควิซและนำเข้าคำถามตัวอย่างแล้ว" : "สร้างควิซแล้ว");
      setQuizzes((prev) => [...prev, created]);
      setSelectedId(created.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "สร้างควิซไม่สำเร็จ");
    } finally {
      setCreatingQuiz(false);
    }
  }

  async function handleSaveMeta(override?: Partial<QuizMeta>) {
    if (!selectedId) return;
    const next: QuizMeta = {
      title: (override?.title ?? title).trim(),
      description: (override?.description ?? description).trim(),
      questionCount: Math.max(0, Math.floor(override?.questionCount ?? questionCount) || 0),
      isActive: override?.isActive ?? isActive,
    };
    setSavingMeta(true);
    setError(null);
    try {
      const saved = await updateQuiz(selectedId, {
        title: next.title,
        description: next.description,
        question_count: next.questionCount,
        is_active: next.isActive,
      });
      setQuizzes((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      if (!override) {
        setTitle(next.title);
        setDescription(next.description);
        setQuestionCount(next.questionCount);
      }
      setIsActive(next.isActive);
      setSavedMeta(next);
      flash(
        override?.isActive !== undefined
          ? next.isActive
            ? "เปิดให้ทำควิซแล้ว"
            : "ปิดควิซแล้ว"
          : "บันทึกข้อมูลควิซแล้ว"
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "บันทึกควิซไม่สำเร็จ");
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete?.ids.length) return;
    setDeleting(true);
    try {
      const result = await deleteMany(pendingDelete.ids, deleteQuizQuestion);
      selection.clear();
      setPendingDelete(null);
      if (selectedId) await loadDetail(selectedId);
      if (result.failed > 0) {
        setError(result.message ?? "ลบบางคำถามไม่สำเร็จ");
      } else {
        flash(result.ok > 1 ? `ลบ ${result.ok} คำถามแล้ว` : "ลบคำถามแล้ว");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminPageFrame
        title={meta.title}
        description={`${meta.description} แสดงที่ ${meta.publicHint}`}
        bodyClassName="space-y-6"
        actions={
          <>
            {quizzes.length === 0 ? (
              <Button type="button" onClick={() => void handleCreateQuiz()} disabled={creatingQuiz}>
                {creatingQuiz ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                สร้างควิซ{meta.label}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleCreateQuiz()}
                disabled={creatingQuiz}
              >
                {creatingQuiz ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                สร้างควิซใหม่
              </Button>
            )}
          </>
        }
      >
        {notice ? <AdminStatus tone="success">{notice}</AdminStatus> : null}
        {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

        {loadingList ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            กำลังโหลดควิซ...
          </div>
        ) : quizzes.length === 0 ? (
          <AdminEmptyState title={meta.empty} />
        ) : (
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1">
            {quizzes.map((quiz) => {
              const active = quiz.id === selectedId;
              return (
                <button
                  key={quiz.id}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedId(quiz.id);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition",
                    active
                      ? "bg-white font-semibold text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      quiz.is_active ? "bg-emerald-500" : "bg-slate-400"
                    )}
                    aria-hidden
                  />
                  {quiz.title}
                </button>
              );
            })}
          </div>
        )}

        {selectedQuiz ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatTile label="คำถามในคลัง" value={`${questions.length} ข้อ`} />
              <StatTile
                label="สุ่มให้ทำต่อครั้ง"
                value={
                  questionCount > 0 && questionCount < questions.length
                    ? `${questionCount} ข้อ`
                    : "ทุกข้อ"
                }
                hint={questionCount > 0 && questionCount < questions.length ? undefined : "ใช้คำถามทั้งหมด"}
              />
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-white px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">สถานะ</p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-semibold tracking-tight",
                      savedMeta?.isActive ? "text-emerald-600" : "text-slate-500"
                    )}
                  >
                    {savedMeta?.isActive ? "เปิดอยู่" : "ปิดอยู่"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{meta.publicHint}</p>
                </div>
                <StatusSwitch
                  checked={savedMeta?.isActive ?? isActive}
                  disabled={savingMeta || !savedMeta}
                  label={meta.audience}
                  onChange={(value) => {
                    if (!savedMeta) return;
                    void handleSaveMeta({ ...savedMeta, isActive: value });
                  }}
                />
              </div>
            </div>

            <section className="rounded-2xl border border-border/70 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight">ข้อมูลควิซ</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">ชื่อและคำอธิบายที่ผู้ทำจะเห็นก่อนเริ่ม</p>
                </div>
                {metaDirty ? (
                  <div className="flex items-center gap-2">
                    <span className="hidden text-xs text-amber-600 sm:inline">มีการแก้ไขที่ยังไม่บันทึก</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={savingMeta}
                      onClick={() => {
                        if (!savedMeta) return;
                        setTitle(savedMeta.title);
                        setDescription(savedMeta.description);
                        setQuestionCount(savedMeta.questionCount);
                      }}
                    >
                      ยกเลิก
                    </Button>
                    <Button type="button" size="sm" onClick={() => void handleSaveMeta()} disabled={savingMeta}>
                      {savingMeta ? <Loader2 className="size-4 animate-spin" /> : null}
                      บันทึก
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">ชื่อควิซ</Label>
                    <Input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-desc">คำอธิบาย</Label>
                    <Input
                      id="quiz-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 lg:w-56">
                  <Label htmlFor="quiz-qcount">จำนวนข้อที่ให้ทำ</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="ลดจำนวนข้อ"
                      onClick={() => setQuestionCount((n) => Math.max(0, n - 1))}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Input
                      id="quiz-qcount"
                      type="number"
                      min={0}
                      className="text-center tabular-nums"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value) || 0)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="เพิ่มจำนวนข้อ"
                      onClick={() => setQuestionCount((n) => n + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">ใส่ 0 เพื่อใช้ทุกข้อในคลัง</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight">คลังคำถาม</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">กดที่คำถามเพื่อแก้ไข</p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="relative flex-1 sm:w-64 sm:flex-none">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="ค้นหาคำถาม"
                      className="pl-9"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={!selectedId || creatingQuiz}
                    onClick={() => {
                      setEditing(null);
                      setFormOpen(true);
                    }}
                  >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">เพิ่มคำถาม</span>
                  </Button>
                </div>
              </div>
              <div className="px-5 py-5 sm:px-6">
              {loadingQuestions || creatingQuiz ? (
                <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {creatingQuiz ? "กำลังนำเข้าคำถามตัวอย่าง..." : "กำลังโหลดคำถาม..."}
                </div>
              ) : questions.length === 0 ? (
                <AdminEmptyState
                  title="ยังไม่มีคำถาม"
                  description='กด "เพิ่มคำถาม" เพื่อใส่โจทย์และตัวเลือก A–D'
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
                      label: `${selection.count} คำถามที่เลือก`,
                    })
                  }
                  deleting={deleting}
                />
                {visibleQuestions.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    ไม่พบคำถามที่ตรงกับ “{query}”
                  </p>
                ) : null}
                <ul className="space-y-3">
                  {visibleQuestions.map(({ question, index: idx }) => (
                    <li
                      key={question.id}
                      role="button"
                      tabIndex={deleting ? undefined : 0}
                      onClick={() => {
                        if (deleting) return;
                        setEditing(question);
                        setFormOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget || deleting) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setEditing(question);
                          setFormOpen(true);
                        }
                      }}
                      className={cn(
                        "group cursor-pointer rounded-xl border bg-white p-4 text-left transition hover:border-primary/30 hover:shadow-[0_6px_18px_rgba(15,29,63,0.06)] sm:p-5",
                        selection.selected.has(question.id)
                          ? "border-primary/40 bg-sky-50/50"
                          : "border-border/70"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <AdminCheckbox
                          className="mt-1"
                          checked={selection.selected.has(question.id)}
                          onCheckedChange={() => selection.toggle(question.id)}
                          disabled={deleting}
                        />
                        <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold leading-relaxed text-foreground">{question.prompt}</p>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {question.options.map((option, optionIndex) => (
                              <li
                                key={option.id}
                                className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-foreground/80"
                              >
                                <span className="mt-px text-xs font-semibold text-primary">
                                  {OPTION_LETTERS[optionIndex] ?? optionIndex + 1}
                                </span>
                                <span className="min-w-0 flex-1 leading-snug">{option.label}</span>
                                <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/70">
                                  {optionHint(kind, option.score_map, clusters)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex shrink-0 opacity-60 transition group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="ลบ"
                            disabled={deleting}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete({
                                ids: [question.id],
                                label: question.prompt.slice(0, 80) || "คำถามนี้",
                              });
                            }}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                </>
              )}
              </div>
            </section>
          </>
        ) : null}
      </AdminPageFrame>

      {selectedId ? (
        <QuizQuestionFormDialog
          quizId={selectedId}
          kind={kind}
          clusters={clusters}
          question={editing}
          nextSortOrder={questions.length + 1}
          open={formOpen}
          onOpenChange={setFormOpen}
          onSaved={() => {
            flash(editing ? "แก้ไขคำถามแล้ว" : "เพิ่มคำถามแล้ว");
            void loadDetail(selectedId);
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
