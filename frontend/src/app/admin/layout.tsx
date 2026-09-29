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
      <div className="admin-shell">
        <SidebarProvider className="h-full min-h-0">
          <AppSidebar />
          <SidebarInset className="admin-main flex min-h-0 flex-col overflow-hidden bg-[#f4f6f9]!">
            <AdminViewProvider>
              <AdminHeader />
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-none p-4 pb-8 sm:p-6 lg:px-8 lg:pb-10">
                {children}
              </div>
            </AdminViewProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminGuard>
  );
}
