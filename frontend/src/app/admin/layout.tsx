"use client";

import { AdminGuard } from "@/features/auth";
import {
  AdminHeader,
  AdminViewProvider,
  AppSidebar,
} from "@/components/admin";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * admin/* — Admin panel shell
 * มี sidebar ของตัวเอง — ไม่มี Navbar / Footer ของเว็บสาธารณะ
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="admin-shell min-h-svh">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="max-h-svh overflow-y-auto bg-[var(--admin-content-bg)]">
            <AdminViewProvider>
              <AdminHeader />
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </AdminViewProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminGuard>
  );
}
