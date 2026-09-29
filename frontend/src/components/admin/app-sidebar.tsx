"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Compass,
  ExternalLink,
  Globe2,
  LayoutDashboard,
  LogOut,
  Settings2,
  UsersRound,
} from "lucide-react";
import { adminNavGroups, canAccessNavItem, type AdminNavItem, type StaffRole } from "@/config/admin-nav";
import { isStaffRole, staffPanelLabel } from "@/config/staff-role";
import { useAuth } from "@/features/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

function initialsFrom(name: string, email: string): string {
  const source = name.trim() || email.trim();
  if (!source) return "??";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function NavItems({
  items,
  pathname,
}: {
  items: AdminNavItem[];
  pathname: string;
}) {
  return (
    <>
      {items.map((item) => {
        const ItemIcon = item.icon;
        const isActive = !item.disabled && pathname === item.href;

        if (item.disabled) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                aria-disabled
                className="pointer-events-none opacity-40"
              >
                <ItemIcon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              className={cn(
                "rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-primary! text-sidebar-primary-foreground! font-medium"
              )}
            >
              <Link href={item.href}>
                <ItemIcon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

function CollapsedGroup({
  label,
  icon: Icon,
  items,
  pathname,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: AdminNavItem[];
  pathname: string;
}) {
  const { isMobile } = useSidebar();
  const groupActive = items.some((item) => !item.disabled && pathname === item.href);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={label}
            isActive={groupActive}
            className="rounded-lg text-sidebar-foreground/80 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Icon />
            <span>{label}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "bottom" : "right"}
          align="start"
          sideOffset={8}
          className="min-w-56 rounded-2xl border-border/80 bg-popover p-1.5 text-popover-foreground shadow-[0_12px_40px_rgba(15,29,63,0.16)]"
        >
          <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
            {label}
          </DropdownMenuLabel>
          {items.map((item) => {
            const ItemIcon = item.icon;
            if (item.disabled) {
              return (
                <DropdownMenuItem key={item.title} disabled className="rounded-xl">
                  <ItemIcon />
                  {item.title}
                </DropdownMenuItem>
              );
            }
            return (
              <DropdownMenuItem key={item.href} asChild className="rounded-xl">
                <Link href={item.href}>
                  <ItemIcon />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const name = user?.displayName || user?.email || "Staff";
  const email = user?.email || "";
  const initials = initialsFrom(name, email);
  const roleLabel = staffPanelLabel(user?.role);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-xl border border-sidebar-border bg-sidebar data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-xl">
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-sidebar-foreground">{name}</span>
                <span className="truncate text-xs text-sidebar-foreground/55">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/45" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64 rounded-2xl border-border/80 bg-popover p-1.5 text-popover-foreground shadow-[0_12px_40px_rgba(15,29,63,0.16)]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={10}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-start gap-3 px-2 py-2.5">
                <Avatar className="size-10 shrink-0 rounded-xl">
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-0.5 text-left leading-snug">
                  <span className="truncate text-[15px] font-semibold text-foreground">
                    {name}
                  </span>
                  {email ? (
                    <span className="truncate text-[13px] text-muted-foreground">
                      {email}
                    </span>
                  ) : null}
                  <span className="mt-1 w-fit rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-primary uppercase">
                    {roleLabel}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-2.5 py-2 text-[13px]">
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                View website
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer rounded-xl px-2.5 py-2 text-[13px]"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user } = useAuth();
  const role: StaffRole | null = isStaffRole(user?.role) ? user.role : null;
  const isDashboard = pathname === "/admin" || pathname === "/admin/dashboard";
  const isCollapsed = state === "collapsed";

  const visibleGroups = adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => role !== null && canAccessNavItem(item, role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="px-3 pt-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="CE KMITL-PCC"
              className="rounded-xl text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/admin">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-[11px] font-semibold tracking-wide text-sidebar-primary-foreground group-data-[collapsible=icon]:size-8">
                  CE
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-sidebar-foreground">CE Studio</span>
                  <span className="truncate text-xs text-sidebar-foreground/55">
                    {staffPanelLabel(role)} Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="pt-1">
          <SidebarGroupLabel className="px-3 text-[11px] font-medium tracking-[0.16em] text-sidebar-foreground/40 uppercase">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isDashboard}
                  tooltip="Dashboard"
                  className={cn(
                    "rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isDashboard &&
                      "bg-sidebar-primary! text-sidebar-primary-foreground! font-medium"
                  )}
                >
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleGroups.map((group) => {
          const GroupIcon =
            group.id === "public"
              ? Globe2
              : group.id === "student"
                ? Compass
                : group.id === "system"
                  ? Settings2
                  : UsersRound;

          if (isCollapsed) {
            return (
              <SidebarGroup key={group.id}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <CollapsedGroup
                      label={group.label}
                      icon={GroupIcon}
                      items={group.items}
                      pathname={pathname}
                    />
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }

          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel className="px-3 text-[11px] font-medium tracking-[0.16em] text-sidebar-foreground/40 uppercase">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavItems items={group.items} pathname={pathname} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-2">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
