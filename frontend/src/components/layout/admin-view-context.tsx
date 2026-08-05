"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminViewTrail = {
  /** เช่น "เพิ่มข้อมูล" / "แก้ไขข้อมูล" — แสดงต่อท้าย breadcrumb */
  actionLabel: string | null;
  /** กดชื่อหน้าใน breadcrumb เพื่อกลับ list */
  onBackToList: (() => void) | null;
};

type AdminViewContextValue = AdminViewTrail & {
  setTrail: (trail: Partial<AdminViewTrail>) => void;
  clearTrail: () => void;
};

const defaultTrail: AdminViewTrail = {
  actionLabel: null,
  onBackToList: null,
};

const AdminViewContext = createContext<AdminViewContextValue | null>(null);

export function AdminViewProvider({ children }: { children: ReactNode }) {
  const [trail, setTrailState] = useState<AdminViewTrail>(defaultTrail);

  const setTrail = useCallback((next: Partial<AdminViewTrail>) => {
    setTrailState((prev) => ({ ...prev, ...next }));
  }, []);

  const clearTrail = useCallback(() => {
    setTrailState(defaultTrail);
  }, []);

  const value = useMemo(
    () => ({
      ...trail,
      setTrail,
      clearTrail,
    }),
    [trail, setTrail, clearTrail]
  );

  return (
    <AdminViewContext.Provider value={value}>{children}</AdminViewContext.Provider>
  );
}

export function useAdminView() {
  const ctx = useContext(AdminViewContext);
  if (!ctx) {
    throw new Error("useAdminView must be used within AdminViewProvider");
  }
  return ctx;
}
