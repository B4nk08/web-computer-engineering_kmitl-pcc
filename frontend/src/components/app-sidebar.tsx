"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  ChevronRight,
  GalleryVerticalEnd,
  Globe2,
  LayoutDashboard,
  LogOut,
  UsersRound,
} from "lucide-react";
import { adminNavGroups, canAccessNavItem, type AdminNavItem } from "@/config/admin-nav";
import { CURRENT_STAFF_ROLE } from "@/config/staff-role";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const mockUser = {
  name: CURRENT_STAFF_ROLE === "teacher" ? "อ.สมชาย ใจดี" : "Admin CE",
  email:
    CURRENT_STAFF_ROLE === "teacher"
      ? "somchai@kmitl.ac.th"
      : "admin@kmitl.ac.th",
  initials: CURRENT_STAFF_ROLE === "teacher" ? "สจ" : "AD",
};

function NavMainGroup({
  label,
  icon: Icon,
  defaultOpen,
  items,
  pathname,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen: boolean;
  items: AdminNavItem[];
  pathname: string;
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [open, setOpen] = React.useState(defaultOpen);
  const groupActive = items.some((item) => !item.disabled && pathname === item.href);

  // ตอนพับ: โชว์แค่ไอคอนหัวข้อ + dropdown เมนูย่อย
  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={label}
              isActive={groupActive}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Icon />
              <span>{label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
            className="min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {label}
            </DropdownMenuLabel>
            {items.map((item) => {
              const ItemIcon = item.icon;
              if (item.disabled) {
                return (
                  <DropdownMenuItem key={item.title} disabled>
                    <ItemIcon />
                    {item.title}
                  </DropdownMenuItem>
                );
              }
              return (
                <DropdownMenuItem key={item.href} asChild>
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

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        onClick={() => setOpen((value) => !value)}
        data-state={open ? "open" : "closed"}
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Icon />
        <span>{label}</span>
        <ChevronRight
          className={cn(
            "ml-auto transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </SidebarMenuButton>
      {open ? (
        <SidebarMenuSub>
          {items.map((item) => {
            const isActive = !item.disabled && pathname === item.href;
            const ItemIcon = item.icon;

            if (item.disabled) {
              return (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton
                    aria-disabled
                    className="pointer-events-none opacity-40"
                  >
                    <ItemIcon />
                    <span>{item.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            }

            return (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <ItemIcon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{mockUser.initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{mockUser.name}</span>
                <span className="truncate text-xs">{mockUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{mockUser.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{mockUser.name}</span>
                  <span className="truncate text-xs">{mockUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
  const isDashboard = pathname === "/admin" || pathname === "/admin/dashboard";

  const visibleGroups = adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessNavItem(item, CURRENT_STAFF_ROLE)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="CE KMITL-PCC"
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">CE KMITL-PCC</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isDashboard} tooltip="Dashboard">
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {visibleGroups.map((group) => {
                const groupActive = group.items.some(
                  (item) => !item.disabled && pathname === item.href
                );
                const GroupIcon = group.id === "public" ? Globe2 : UsersRound;

                return (
                  <NavMainGroup
                    key={group.id}
                    label={group.label}
                    icon={GroupIcon}
                    defaultOpen={group.id === "public" || groupActive}
                    items={group.items}
                    pathname={pathname}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
