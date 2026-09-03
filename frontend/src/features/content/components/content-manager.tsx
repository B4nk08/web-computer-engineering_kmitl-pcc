"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminView } from "@/components/layout/admin-view-context";
import { ApiError } from "@/lib/api";
import { listContents } from "../api";
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
  const [loading, setLoading] = useState(supported);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<ViewState>({ kind: "list" });

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
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      {!supported ? (
        <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-12 text-center">
          <p className="text-sm font-medium">ยังไม่มี API สำหรับประเภทนี้</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Backend รองรับเฉพาะ page, staff, student_work, video, career_path, admissions
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-10 text-center">
          <AlertCircle className="size-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">โหลดข้อมูลไม่สำเร็จ</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
            ลองอีกครั้ง
          </Button>
        </div>
      ) : (
        <ContentList
          items={items}
          loading={loading || refreshing}
          onEdit={openEdit}
        />
      )}
    </div>
  );
}
