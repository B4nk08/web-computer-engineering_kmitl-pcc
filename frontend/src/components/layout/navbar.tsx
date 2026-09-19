"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { isStaffRole, staffPanelLabel } from "@/config/staff-role";
import {
  ABOUT_US_ITEMS,
  ACADEMICS_ITEMS,
  FACULTY_ITEMS,
  NEWS_ITEMS,
  STUDENT_ITEMS,
  visibleNavItems,
  type NavItem,
} from "@/config/nav-items";
import { cn } from "@/lib/utils";

/**
 * Navbar.tsx
 * ----------
 * แถบเมนูบนสุดของเว็บไซต์ ใช้ร่วมกันทุกหน้า (วางไว้ใน layout.tsx)
 *
 * หน้า Home: โปร่งทับวิดีโอตอนอยู่บนสุด → ทึบเมื่อเลื่อนลง
 * หน้า Quiz: แถบใสทั้งแถบ ไม่มีพื้น/เบลอ
 * หน้าอื่น: ทึบตลอด + spacer กันเนื้อหาถูกทับ
 */

function scrollToHash(href: string) {
  const hash = href.includes("#") ? href.split("#")[1] : "";
  if (!hash) return;
  window.setTimeout(() => {
    document
      .getElementById(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function DropdownItem({
  label,
  href,
  onNavigate,
  light = false,
}: NavItem & { onNavigate?: () => void; light?: boolean }) {
  return (
    <Link
      href={href}
      onClick={() => {
        onNavigate?.();
        scrollToHash(href);
      }}
      className={cn(
        "block rounded-md px-4 py-2.5 text-sm transition-colors focus-visible:outline-none",
        light
          ? "text-[var(--navy-900)] hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]"
          : "text-white/90 hover:bg-[var(--navy-800)] hover:text-white focus-visible:bg-[var(--navy-800)] focus-visible:text-white",
      )}
    >
      {label}
    </Link>
  );
}

function NavDropdown({
  label,
  href,
  items,
  mobileOpen,
  onToggleMobile,
  onNavigate,
  light = false,
}: {
  label: string;
  href?: string;
  items: NavItem[];
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
  onNavigate?: () => void;
  light?: boolean;
}) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const isMobileControlled = mobileOpen !== undefined;
  const open = isMobileControlled ? mobileOpen : hoverOpen;

  const labelClass = cn(
    "py-2 text-sm font-medium transition-colors md:text-[15px]",
    light
      ? "text-[var(--navy-900)] hover:text-[var(--accent)]"
      : "text-white/90 hover:text-[var(--accent)]",
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => !isMobileControlled && setHoverOpen(true)}
      onMouseLeave={() => !isMobileControlled && setHoverOpen(false)}
    >
      <div className="flex items-center gap-1">
        {href ? (
          <Link
            href={href}
            onClick={() => {
              onNavigate?.();
              scrollToHash(href);
            }}
            className={labelClass}
          >
            {label}
          </Link>
        ) : (
          <button type="button" onClick={onToggleMobile} className={labelClass}>
            {label}
          </button>
        )}
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label={`เปิดเมนูย่อย ${label}`}
          className={cn(
            "flex items-center py-2 transition-colors hover:text-[var(--accent)]",
            light ? "text-[var(--navy-900)]" : "text-white/90",
          )}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "absolute left-0 top-full z-40 hidden w-52 origin-top rounded-xl p-2 shadow-xl backdrop-blur transition-all duration-150 md:block",
          light
            ? "bg-white/95 ring-1 ring-black/5"
            : "bg-[var(--navy-950)]/95 ring-1 ring-white/10",
          open
            ? "visible translate-y-1 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {items.map((item) => (
          <DropdownItem
            key={item.label}
            {...item}
            light={light}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {isMobileControlled && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            open ? "max-h-80" : "max-h-0",
          )}
        >
          <div
            className={cn(
              "mt-1 space-y-1 rounded-lg p-2",
              light ? "bg-black/5" : "bg-white/5",
            )}
          >
            {items.map((item) => (
              <DropdownItem
                key={item.label}
                {...item}
                light={light}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isQuiz =
    pathname.startsWith("/academics/quiz") ||
    pathname.startsWith("/student/quiz-recommend");
  const overlayNav = isHome || isQuiz;
  const solidNav = isQuiz
    ? mobileMenuOpen
    : !overlayNav || scrolled || mobileMenuOpen;
  const role = user?.role;
  const newsItems = visibleNavItems(NEWS_ITEMS, role);
  const facultyItems = visibleNavItems(FACULTY_ITEMS, role);
  const studentItems = visibleNavItems(STUDENT_ITEMS, role);
  const showStaffPanel = isStaffRole(role);
  const panelLabel = staffPanelLabel(role);

  useEffect(() => {
    if (!overlayNav) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlayNav]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  const handleLogout = () => {
    logout();
    closeMobile();
    router.push("/");
  };

  const linkClass = cn(
    "py-2 text-[15px] font-medium transition-colors hover:text-[var(--accent)]",
    isQuiz ? "text-[var(--navy-900)]" : "text-white/90",
  );
  const pillClass = cn(
    "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:flex",
    isQuiz
      ? "border-[var(--navy-900)]/20 text-[var(--navy-900)]"
      : "border-white/15 text-white/90",
  );
  const mobilePillClass = cn(
    "mt-2 flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-xs font-medium sm:hidden",
    isQuiz
      ? "border-[var(--navy-900)]/20 text-[var(--navy-900)]"
      : "border-white/15 text-white/90",
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300",
          isQuiz && !mobileMenuOpen
            ? "bg-transparent shadow-none"
            : overlayNav && !solidNav
              ? "bg-gradient-to-b from-black/55 via-black/25 to-transparent shadow-none backdrop-blur-md"
              : isQuiz
                ? "bg-white/95 shadow-sm"
                : "bg-[var(--navy-950)] shadow-md",
        )}
      >
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-3 sm:px-4 md:px-5">
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

          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <Link href="/" className={linkClass}>
              Home
            </Link>
            <NavDropdown
              label="About Us"
              href="/#about"
              items={ABOUT_US_ITEMS}
              light={isQuiz}
            />
            <NavDropdown
              label="News"
              href="/news"
              items={newsItems}
              light={isQuiz}
            />
            <NavDropdown
              label="Academics"
              items={ACADEMICS_ITEMS}
              light={isQuiz}
            />
            {facultyItems.length > 0 ? (
              <NavDropdown
                label="Faculty"
                items={facultyItems}
                light={isQuiz}
              />
            ) : null}
            {studentItems.length > 0 ? (
              <NavDropdown
                label="Student"
                items={studentItems}
                light={isQuiz}
              />
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {!authLoading && showStaffPanel ? (
              <Link href="/admin" className={pillClass}>
                {panelLabel}
              </Link>
            ) : null}
            {!authLoading &&
              (isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  title={
                    user?.displayName
                      ? `ออกจากระบบ (${user.displayName})`
                      : "ออกจากระบบ"
                  }
                  className={pillClass}
                >
                  Logout
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link href="/login" className={pillClass}>
                  Login
                  <LogIn className="h-3.5 w-3.5" />
                </Link>
              ))}

            <button
              type="button"
              aria-label="เปิดเมนู"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md md:hidden",
                isQuiz ? "text-[var(--navy-900)]" : "text-white",
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            isQuiz ? "bg-white/95" : "bg-[var(--navy-950)]",
            mobileMenuOpen
              ? cn(
                  "max-h-[720px] border-t",
                  isQuiz ? "border-black/5" : "border-white/10",
                )
              : "max-h-0",
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link href="/" onClick={closeMobile} className={linkClass}>
              Home
            </Link>
            <NavDropdown
              label="About Us"
              href="/#about"
              items={ABOUT_US_ITEMS}
              mobileOpen={mobileDropdown === "about"}
              onToggleMobile={() =>
                setMobileDropdown((d) => (d === "about" ? null : "about"))
              }
              onNavigate={closeMobile}
              light={isQuiz}
            />
            <NavDropdown
              label="News"
              href="/news"
              items={newsItems}
              mobileOpen={mobileDropdown === "news"}
              onToggleMobile={() =>
                setMobileDropdown((d) => (d === "news" ? null : "news"))
              }
              onNavigate={closeMobile}
              light={isQuiz}
            />
            <NavDropdown
              label="Academics"
              items={ACADEMICS_ITEMS}
              mobileOpen={mobileDropdown === "academics"}
              onToggleMobile={() =>
                setMobileDropdown((d) =>
                  d === "academics" ? null : "academics",
                )
              }
              onNavigate={closeMobile}
              light={isQuiz}
            />
            {facultyItems.length > 0 ? (
              <NavDropdown
                label="Faculty"
                items={facultyItems}
                mobileOpen={mobileDropdown === "faculty"}
                onToggleMobile={() =>
                  setMobileDropdown((d) => (d === "faculty" ? null : "faculty"))
                }
                onNavigate={closeMobile}
                light={isQuiz}
              />
            ) : null}
            {studentItems.length > 0 ? (
              <NavDropdown
                label="Student"
                items={studentItems}
                mobileOpen={mobileDropdown === "student"}
                onToggleMobile={() =>
                  setMobileDropdown((d) => (d === "student" ? null : "student"))
                }
                onNavigate={closeMobile}
                light={isQuiz}
              />
            ) : null}
            {!authLoading && showStaffPanel ? (
              <Link
                href="/admin"
                onClick={closeMobile}
                className={cn(linkClass, "sm:hidden")}
              >
                {panelLabel}
              </Link>
            ) : null}
            {!authLoading &&
              (isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={mobilePillClass}
                >
                  Logout
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className={mobilePillClass}
                >
                  Login
                  <LogIn className="h-4 w-4" />
                </Link>
              ))}
          </div>
        </div>
      </header>

      {/* หน้า Home / Quiz ไม่ใส่ spacer — ให้พื้นหลังเต็มจอใต้ navbar โปร่ง */}
      {!overlayNav ? <div className="h-16 shrink-0" aria-hidden /> : null}
    </>
  );
}
