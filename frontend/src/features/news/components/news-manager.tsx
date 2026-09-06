"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminView } from "@/components/admin";
import { ApiError } from "@/lib/api";
import { listNews } from "../api";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<ViewState>({ kind: "list" });

  const [audienceFilter, setAudienceFilter] = useState<"all" | NewsItem["audience"]>("all");

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
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "ทั้งหมด" },
            { id: "external", label: "External" },
            { id: "internal", label: "Internal" },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={audienceFilter === tab.id ? "default" : "outline"}
            onClick={() => setAudienceFilter(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-10 text-center">
          <AlertCircle className="size-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">โหลดข้อมูลไม่สำเร็จ</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => void load("refresh")}>
            ลองอีกครั้ง
          </Button>
        </div>
      ) : (
        <NewsList
          items={items}
          loading={loading || refreshing}
          onEdit={(id) => setView({ kind: "form", mode: "edit", editId: id })}
        />
      )}
    </div>
  );
}
