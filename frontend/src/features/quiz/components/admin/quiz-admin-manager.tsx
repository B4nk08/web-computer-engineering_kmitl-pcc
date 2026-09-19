"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { QuizQuestionAddButton, QuizQuestionFormDialog } from "./quiz-question-form-dialog";

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

  async function handleSaveMeta() {
    if (!selectedId) return;
    setSavingMeta(true);
    setError(null);
    try {
      const saved = await updateQuiz(selectedId, {
        title: title.trim(),
        description: description.trim(),
        question_count: Number.isFinite(questionCount) ? Math.max(0, Math.floor(questionCount)) : 0,
        is_active: isActive,
      });
      setQuizzes((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      flash("บันทึกข้อมูลควิซแล้ว");
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
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleCreateQuiz()}
                  disabled={creatingQuiz}
                >
                  {creatingQuiz ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  สร้างควิซใหม่
                </Button>
                <QuizQuestionAddButton
                  disabled={!selectedId || creatingQuiz}
                  onClick={() => {
                    setEditing(null);
                    setFormOpen(true);
                  }}
                />
              </div>
            )}
          </>
        }
      >
        {notice ? <AdminStatus tone="success">{notice}</AdminStatus> : null}
        {error ? <AdminStatus tone="error">{error}</AdminStatus> : null}

        <AdminSection title="ชุดควิซ" description={meta.publicHint}>
          {loadingList ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              กำลังโหลดควิซ...
            </div>
          ) : quizzes.length === 0 ? (
            <AdminEmptyState title={meta.empty} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {quizzes.map((quiz) => (
                <AdminPill
                  key={quiz.id}
                  active={quiz.id === selectedId}
                  muted={!quiz.is_active}
                  onClick={() => setSelectedId(quiz.id)}
                >
                  {quiz.title}
                  {!quiz.is_active ? <span className="text-xs opacity-80">(ปิด)</span> : null}
                </AdminPill>
              ))}
            </div>
          )}
        </AdminSection>

        {selectedQuiz ? (
          <>
            <AdminSection
              title="ตั้งค่าควิซ"
              description="ชื่อ คำอธิบาย จำนวนข้อที่สุ่ม และสถานะเปิดให้ทำ"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">ชื่อควิซ</Label>
                    <Input
                      id="quiz-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-qcount">จำนวนข้อที่ให้ทำ</Label>
                    <Input
                      id="quiz-qcount"
                      type="number"
                      min={0}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      คลังมี {questions.length} ข้อ — ใส่ 0 เพื่อใช้ทุกข้อ
                      {questions.length > 0 && questionCount > 0 && questionCount < questions.length
                        ? ` · จะสุ่มมา ${questionCount} ข้อตอนเริ่มทำ`
                        : null}
                    </p>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="quiz-desc">คำอธิบาย</Label>
                    <Input
                      id="quiz-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <AdminToggle
                    checked={isActive}
                    onChange={setIsActive}
                    label={meta.audience}
                  />
                  <div className="flex items-end">
                    <Button type="button" onClick={() => void handleSaveMeta()} disabled={savingMeta}>
                      {savingMeta ? <Loader2 className="size-4 animate-spin" /> : null}
                      บันทึกควิซ
                    </Button>
                  </div>
              </div>
            </AdminSection>

            <AdminSection
              title={`คลังคำถาม (${questions.length} ข้อ)`}
              description={
                questions.length > 0 && questionCount > 0 && questionCount < questions.length
                  ? `สุ่มให้ทำ ${questionCount} ข้อ`
                  : "เพิ่ม แก้ไข หรือลบโจทย์ได้ทุกข้อ"
              }
            >
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
                <ul className="space-y-3">
                  {questions.map((question, idx) => (
                    <li key={question.id} className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <AdminCheckbox
                          className="mt-1.5"
                          checked={selection.selected.has(question.id)}
                          onCheckedChange={() => selection.toggle(question.id)}
                          disabled={deleting}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex size-7 items-center justify-center rounded-xl bg-[#d4652b] text-xs font-semibold text-white">
                            {idx + 1}
                          </span>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{question.prompt}</p>
                          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                            {question.options.map((option, optionIndex) => (
                              <li key={option.id} className="flex flex-wrap items-start gap-2">
                                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-foreground">
                                  {["A", "B", "C", "D"][optionIndex] ?? optionIndex + 1}
                                </span>
                                <span className="min-w-0 flex-1">{option.label}</span>
                                <AdminBadge tone="accent">
                                  {optionHint(kind, option.score_map, clusters)}
                                </AdminBadge>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="แก้ไข"
                            onClick={() => {
                              setEditing(question);
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
                                ids: [question.id],
                                label: question.prompt.slice(0, 80) || "คำถามนี้",
                              })
                            }
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
            </AdminSection>
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
