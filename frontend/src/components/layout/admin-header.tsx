"use client";

import { usePathname } from "next/navigation";
import { adminNavGroups, findAdminNavItem } from "@/config/admin-nav";
import { useAdminView } from "@/components/layout/admin-view-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  const pathname = usePathname();
  const { actionLabel, onBackToList } = useAdminView();
  const isDashboard = pathname === "/admin" || pathname === "/admin/dashboard";
  const current = findAdminNavItem(pathname);
  const group = adminNavGroups.find((g) =>
    g.items.some((item) => item.href === pathname)
  );
  const title = isDashboard ? "Dashboard" : (current?.title ?? "Admin");

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-black/5 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {isDashboard && !actionLabel ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <>
                {group && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/admin">{group.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  {actionLabel && onBackToList ? (
                    <BreadcrumbLink
                      href={pathname}
                      onClick={(e) => {
                        e.preventDefault();
                        onBackToList();
                      }}
                    >
                      {title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {actionLabel ? (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{actionLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : null}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
