"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminConfirmDialog,
  AdminPageFrame,
  AdminPill,
  AdminSelectionBar,
  AdminStatus,
  deleteConfirmCopy,
  deleteMany,
  useAdminSelection,
  useAdminView,
  type PendingDelete,
} from "@/components/admin";
import { ApiError } from "@/lib/api";
import { deleteNews, listNews } from "../api";
import type { NewsItem } from "../types";
import { NewsFormView, type NewsFormMode } from "./news-form-view";
import { NewsList } from "./news-list";

type ViewState =
  | { kind: "list" }
  | { kind: "form"; mode: NewsFormMode; editId: string | null };

type NewsManagerProps = {
  title: string;
  description: string;
};

export function NewsManager({ title, description }: NewsManagerProps) {
  const { setTrail, clearTrail } = useAdminView();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<ViewState>({ kind: "list" });
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [audienceFilter, setAudienceFilter] = useState<"all" | NewsItem["audience"]>("all");
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);
  const selection = useAdminSelection(itemIds);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  const load = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await listNews(
        audienceFilter === "all" ? {} : { audience: audienceFilter }
      );
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "โหลดข้อมูลไม่สำเร็จ"
      );
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [audienceFilter]);

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
    return () => clearTrail();
  }, [view, setTrail, clearTrail, backToList]);

  async function handleConfirmDelete() {
    if (!pendingDelete?.ids.length) return;
    setDeleting(true);
    try {
      const result = await deleteMany(pendingDelete.ids, deleteNews);
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

  if (view.kind === "form") {
    return (
      <NewsFormView
        mode={view.mode}
        sectionTitle={title}
        editId={view.editId}
        onCancel={backToList}
        onSuccess={() => {
          setView({ kind: "list" });
          void load("refresh");
        }}
      />
    );
  }

  return (
    <AdminPageFrame
      title={title}
      description={description}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void load("refresh")}
            disabled={loading || refreshing}
            aria-label="รีเฟรช"
          >
            <RefreshCw className={`size-4 ${loading || refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            type="button"
            onClick={() => setView({ kind: "form", mode: "create", editId: null })}
          >
            <Plus className="size-4" />
            เพิ่มข้อมูล
          </Button>
        </>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "ทั้งหมด" },
            { id: "external", label: "รับสมัคร" },
            { id: "internal", label: "ภายในสาขา" },
          ] as const
        ).map((tab) => (
          <AdminPill
            key={tab.id}
            active={audienceFilter === tab.id}
            onClick={() => setAudienceFilter(tab.id)}
          >
            {tab.label}
          </AdminPill>
        ))}
      </div>

      {notice ? <div className="mb-4"><AdminStatus tone="success">{notice}</AdminStatus></div> : null}
      {error ? (
        <div className="mb-4 space-y-3">
          <AdminStatus tone="error">{error}</AdminStatus>
          <Button type="button" variant="outline" size="sm" onClick={() => void load("refresh")}>
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
          <NewsList
            items={items}
            loading={loading || refreshing}
            selectedIds={selection.selected}
            onToggle={selection.toggle}
            onEdit={(id) => setView({ kind: "form", mode: "edit", editId: id })}
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
    </AdminPageFrame>
  );
}
