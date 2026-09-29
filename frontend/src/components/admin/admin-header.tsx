"use client";

import { usePathname } from "next/navigation";
import { adminNavGroups, findAdminNavItem } from "@/config/admin-nav";
import { useAdminView } from "@/components/admin/admin-view-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-white px-4 sm:h-16 sm:px-6 lg:px-8">
      <SidebarTrigger className="-ml-1 rounded-lg border border-border bg-white hover:bg-muted" />
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          {isDashboard && !actionLabel ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              {group && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/admin"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {group.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              <BreadcrumbItem>
                {actionLabel && onBackToList ? (
                  <BreadcrumbLink
                    href={pathname}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToList();
                    }}
                  >
                    {title}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {title}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {actionLabel ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-foreground">
                      {actionLabel}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : null}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
