"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminPageFrame,
  AdminSelectionBar,
  AdminStatus,
  deleteConfirmCopy,
  deleteMany,
  useAdminSelection,
  useAdminView,
  type PendingDelete,
} from "@/components/admin";
import { ApiError } from "@/lib/api";
import { deleteContent, listContents } from "../api";
import type { ContentItem, ContentManagerProps } from "../types";
import { isApiContentType } from "../types";
import { ContentFormView, type ContentFormMode } from "./content-form-view";
import { ContentList } from "./content-list";

type ViewState =
  | { kind: "list" }
  | { kind: "form"; mode: ContentFormMode; editId: string | null };

export function ContentManager({ type, title, description }: ContentManagerProps) {
  const supported = isApiContentType(type);
  const { setTrail, clearTrail } = useAdminView();

  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(supported);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<ViewState>({ kind: "list" });
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);
  const selection = useAdminSelection(itemIds);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  const load = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!isApiContentType(type)) {
        setItems([]);
        setLoading(false);
        setRefreshing(false);
        setError(null);
        return;
      }

      if (mode === "initial") setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const data = await listContents({ type });
        setItems(data);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "โหลดข้อมูลไม่สำเร็จ";
        setError(message);
        setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [type]
  );

  useEffect(() => {
    void load("initial");
  }, [load]);

  const backToList = useCallback(() => {
    setView({ kind: "list" });
  }, []);

  useEffect(() => {
    if (view.kind === "form") {
      setTrail({
        actionLabel: view.mode === "create" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล",
        onBackToList: backToList,
      });
    } else {
      clearTrail();
    }

    return () => {
      clearTrail();
    };
  }, [view, setTrail, clearTrail, backToList]);

  function handleRefresh() {
    void load("refresh");
  }

  function openCreate() {
    setView({ kind: "form", mode: "create", editId: null });
  }

  function openEdit(id: string) {
    setView({ kind: "form", mode: "edit", editId: id });
  }

  async function handleFormSuccess() {
    setView({ kind: "list" });
    await load("refresh");
  }

  async function handleConfirmDelete() {
    if (!pendingDelete?.ids.length) return;
    setDeleting(true);
    try {
      const result = await deleteMany(pendingDelete.ids, deleteContent);
      selection.clear();
      setPendingDelete(null);
      await load("refresh");
      if (result.failed > 0) {
        setError(result.message ?? "ลบบางรายการไม่สำเร็จ");
      } else {
        flash(result.ok > 1 ? `ลบ ${result.ok} รายการแล้ว` : "ลบรายการแล้ว");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (supported && view.kind === "form") {
    return (
      <ContentFormView
        mode={view.mode}
        type={type}
        sectionTitle={title}
        editId={view.editId}
        onCancel={backToList}
        onSuccess={() => void handleFormSuccess()}
      />
    );
  }

  return (
    <AdminPageFrame
      title={title}
      description={description}
      actions={
        <>
          {supported ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              aria-label="รีเฟรช"
            >
              <RefreshCw
                className={`size-4 ${loading || refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          ) : null}
          <Button type="button" onClick={openCreate} disabled={!supported}>
            <Plus className="size-4" />
            เพิ่มข้อมูล
          </Button>
        </>
      }
    >
      {!supported ? (
        <AdminEmptyState
          title="ยังไม่มี API สำหรับประเภทนี้"
          description="Backend รองรับเฉพาะ page, staff, student_work, video, career_path, admissions"
        />
      ) : (
        <>
          {notice ? (
            <div className="mb-4">
              <AdminStatus tone="success">{notice}</AdminStatus>
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 space-y-3">
              <AdminStatus tone="error">{error}</AdminStatus>
              <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
                ลองอีกครั้ง
              </Button>
            </div>
          ) : null}
          {!error || items.length > 0 ? (
            <>
              <AdminSelectionBar
                total={items.length}
                selectedCount={selection.count}
                allSelected={selection.allSelected}
                someSelected={selection.someSelected}
                onToggleAll={selection.setAll}
                onDeleteSelected={() =>
                  setPendingDelete({
                    ids: selection.selectedIds,
                    label: `${selection.count} รายการที่เลือก`,
                  })
                }
                deleting={deleting}
              />
              <ContentList
                items={items}
                loading={loading || refreshing}
                selectedIds={selection.selected}
                onToggle={selection.toggle}
                onEdit={openEdit}
                onDelete={(item) =>
                  setPendingDelete({ ids: [item.id], label: item.title || "รายการนี้" })
                }
                deleting={deleting}
              />
            </>
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
      )}
    </AdminPageFrame>
  );
}
