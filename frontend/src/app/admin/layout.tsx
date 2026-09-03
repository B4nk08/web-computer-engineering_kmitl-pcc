"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminViewProvider } from "@/components/layout/admin-view-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
