"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * use-role.tsx
 * ------------
 * โปรเจกต์นี้เป็น Frontend อย่างเดียว (ยังไม่ต่อ backend/ระบบล็อกอินจริง)
 * จึงจำลอง "บทบาทผู้ใช้" ด้วย React Context เพื่อสลับดูเมนู/หน้าตาเว็บได้ทั้ง 2 แบบ:
 *   - "guest"  = บุคคลทั่วไป        -> เมนู Home, About Us, Academics
 *   - "member" = นักศึกษา/อาจารย์/แอดมิน -> เมนู Home, About Us, Academics, Faculty, Student
 *
 * เมื่อเชื่อมต่อระบบล็อกอินจริง (เช่น NextAuth) ให้แทนที่ state ภายใน
 * RoleProvider ด้วยข้อมูล session จริงได้เลย โดยไม่ต้องแก้ไฟล์ที่เรียกใช้ useRole()
 */

type Role = "guest" | "member";

interface RoleContextValue {
  role: Role;
  login: () => void;
  logout: () => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");

  const login = () => setRole("member");
  const logout = () => setRole("guest");
  const toggleRole = () => setRole((r) => (r === "guest" ? "member" : "guest"));

  return (
    <RoleContext.Provider value={{ role, login, logout, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole ต้องถูกใช้ภายใน <RoleProvider>");
  return ctx;
}
