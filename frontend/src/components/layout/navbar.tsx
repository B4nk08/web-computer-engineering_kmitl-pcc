"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import {
  ABOUT_US_ITEMS,
  ACADEMICS_ITEMS,
  FACUITY_ITEMS,
  STUDENT_ITEMS,
  type NavItem,
} from "@/config/nav-items";
import { cn } from "@/lib/utils";

/**
 * Navbar.tsx
 * ----------
 * แถบเมนูบนสุดของเว็บไซต์ ใช้ร่วมกันทุกหน้า (วางไว้ใน layout.tsx)
 *
 * พฤติกรรม:
 * - เมนูที่มีลูกศร (About Us, Academics, Faculty, Student) ดรอปดาวน์ลงมา
 *   เมื่อเอาเมาส์ชี้ (desktop) หรือกดแตะ (มือถือ)
 * - รายการย่อยในดรอปดาวน์: hover แล้วได้พื้นหลังสีน้ำเงินเข้ม ตัวอักษรขาว
 *   ส่วนที่ไม่ได้ชี้เป็นตัวหนังสือเฉยๆ ไม่มีพื้นหลัง
 * - เมนูเปลี่ยนตามบทบาทผู้ใช้ (ดู hooks/use-role.tsx):
 *     guest  -> Home, About Us, Academics
 *     member -> Home, About Us, Academics, Faculty, Student
 * - Responsive: จอเล็กยุบเป็นปุ่มแฮมเบอร์เกอร์ กดเปิดเป็นเมนูแบบเลื่อนลง (accordion)
 */

function DropdownItem({ label, href }: NavItem) {
  return (
    <Link
      href={href}
      className="block rounded-md px-4 py-2.5 text-sm text-white/90 transition-colors
                 hover:bg-[var(--navy-800)] hover:text-white
                 focus-visible:bg-[var(--navy-800)] focus-visible:text-white focus-visible:outline-none"
    >
      {label}
    </Link>
  );
}

function NavDropdown({
  label,
  items,
  mobileOpen,
  onToggleMobile,
}: {
  label: string;
  items: NavItem[];
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
}) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const isMobileControlled = mobileOpen !== undefined;
  const open = isMobileControlled ? mobileOpen : hoverOpen;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      <button
        type="button"
        onClick={onToggleMobile}
        className="flex items-center gap-1 py-2 text-sm font-medium text-white/90 transition-colors hover:text-[var(--accent)] md:text-[15px]"
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Desktop: dropdown panel ลอยด้านล่างเมนู */}
      <div
        className={cn(
          "absolute left-0 top-full z-40 hidden w-44 origin-top rounded-xl bg-[var(--navy-950)]/95 p-2 shadow-xl ring-1 ring-white/10 backdrop-blur transition-all duration-150 md:block",
          open ? "visible translate-y-1 opacity-100" : "invisible -translate-y-1 opacity-0"
        )}
      >
        {items.map((item) => (
          <DropdownItem key={item.label} {...item} />
        ))}
      </div>

      {/* Mobile: dropdown แบบ accordion แทรกในเมนู */}
      {isMobileControlled && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            open ? "max-h-60" : "max-h-0"
          )}
        >
          <div className="mt-1 space-y-1 rounded-lg bg-white/5 p-2">
            {items.map((item) => (
              <DropdownItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  /** ล็อกอินแล้ว — แสดงเมนู Faculty/Student และซ่อนปุ่ม Login */
  const isMember = isAuthenticated;

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  const handleLogout = () => {
    logout();
    closeMobile();
    router.push("/");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-[var(--navy-950)] shadow-md">
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-3 sm:px-4 md:px-5">
          {/* โลโก้ — ชิดซ้าย */}
          <Link
            href="/"
            onClick={closeMobile}
            className="relative flex h-11 w-32 shrink-0 items-center md:w-44"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoce.png"
              alt="KMITL Computer Logo"
              className="h-full w-full object-contain object-left"
            />
          </Link>

          {/* เมนูหลัก: desktop */}
          <div className="hidden items-center gap-6 lg:gap-8 md:flex">
            <Link
              href="/"
              className="py-2 text-[15px] font-medium text-white/90 transition-colors hover:text-[var(--accent)]"
            >
              Home
            </Link>
            <NavDropdown label="About Us" items={ABOUT_US_ITEMS} />
            <NavDropdown label="Academics" items={ACADEMICS_ITEMS} />
            {isMember && (
              <>
                <NavDropdown label="Faculty" items={FACUITY_ITEMS} />
                <NavDropdown label="Student" items={STUDENT_ITEMS} />
              </>
            )}
          </div>

          {/* ปุ่ม Login (เฉพาะยังไม่ล็อกอิน) / Logout + แฮมเบอร์เกอร์ */}
          <div className="flex shrink-0 items-center gap-3">
            {!authLoading &&
              (isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  title={user?.displayName ? `ออกจากระบบ (${user.displayName})` : "ออกจากระบบ"}
                  className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:flex"
                >
                  Logout
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:flex"
                >
                  Login
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
              ))}

            <button
              type="button"
              aria-label="เปิดเมนู"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* เมนูหลัก: mobile (แบบเลื่อนลง) */}
        <div
          className={cn(
            "overflow-hidden bg-[var(--navy-950)] transition-all duration-200 md:hidden",
            mobileMenuOpen ? "max-h-[520px] border-t border-white/10" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link href="/" onClick={closeMobile} className="py-2 text-[15px] font-medium text-white/90">
              Home
            </Link>
            <NavDropdown
              label="About Us"
              items={ABOUT_US_ITEMS}
              mobileOpen={mobileDropdown === "about"}
              onToggleMobile={() => setMobileDropdown((d) => (d === "about" ? null : "about"))}
            />
            <NavDropdown
              label="Academics"
              items={ACADEMICS_ITEMS}
              mobileOpen={mobileDropdown === "academics"}
              onToggleMobile={() => setMobileDropdown((d) => (d === "academics" ? null : "academics"))}
            />
            {isMember && (
              <>
                <NavDropdown
                  label="Faculty"
                  items={FACUITY_ITEMS}
                  mobileOpen={mobileDropdown === "faculty"}
                  onToggleMobile={() => setMobileDropdown((d) => (d === "faculty" ? null : "faculty"))}
                />
                <NavDropdown
                  label="Student"
                  items={STUDENT_ITEMS}
                  mobileOpen={mobileDropdown === "student"}
                  onToggleMobile={() => setMobileDropdown((d) => (d === "student" ? null : "student"))}
                />
              </>
            )}
            {!authLoading &&
              (isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-1.5 self-start rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/90 sm:hidden"
                >
                  Logout
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="mt-2 flex items-center gap-1.5 self-start rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/90 sm:hidden"
                >
                  Login
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
              ))}
          </div>
        </div>
      </header>
      {/* spacer ให้เนื้อหาไม่ถูก navbar ทับ (ความสูงเท่าแถบเมนู) */}
      <div className="h-16 shrink-0" aria-hidden />
    </>
  );
}
