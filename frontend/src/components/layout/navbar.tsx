"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { isStaffRole, staffPanelLabel } from "@/config/staff-role";
import { NAV_GROUPS, visibleNavItems, type NavItem } from "@/config/nav-items";
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
  glass = false,
}: NavItem & { onNavigate?: () => void; light?: boolean; glass?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href;
  const onLight = light && !glass;

  return (
    <Link
      href={href}
      onClick={() => {
        onNavigate?.();
        scrollToHash(href);
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none md:text-center",
        onLight
          ? active
            ? "bg-[var(--navy-900)] text-white"
            : "text-[var(--navy-900)] hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]"
          : active
            ? "bg-white text-[var(--navy-900)] shadow-sm"
            : "text-white/90 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white",
      )}
    >
      {label}
    </Link>
  );
}

/**
 * เมนูกลุ่ม — ตั้งแต่ 2 รายการ: กดหรือชี้ที่ชื่อเพื่อเปิดรายการ (ชื่อไม่พาไปหน้าไหน)
 * เหลือรายการเดียว: แสดงเป็นลิงก์ตรง ไม่มีลูกศร
 */
function NavDropdown({
  label,
  items,
  mobileOpen,
  onToggleMobile,
  onNavigate,
  light = false,
}: {
  label: string;
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

  if (items.length === 0) return null;

  if (items.length === 1) {
    const only = items[0];
    return (
      <Link
        href={only.href}
        onClick={() => {
          onNavigate?.();
          scrollToHash(only.href);
        }}
        className={labelClass}
      >
        {label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => !isMobileControlled && setHoverOpen(true)}
      onMouseLeave={() => !isMobileControlled && setHoverOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          if (isMobileControlled) onToggleMobile?.();
          else setHoverOpen((v) => !v);
        }}
        className={cn(labelClass, "flex items-center gap-1")}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute top-full left-1/2 z-40 hidden w-max min-w-48 origin-top whitespace-nowrap -translate-x-1/2 space-y-1 rounded-2xl p-2 before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-[''] shadow-[0_16px_40px_rgba(5,12,32,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-150 md:block",
          "bg-[var(--navy-950)]/80 ring-1 ring-white/15",
          open ? "visible mt-2 opacity-100" : "invisible mt-0 opacity-0",
        )}
      >
        {items.map((item) => (
          <DropdownItem
            key={item.label}
            {...item}
            glass
            onNavigate={() => {
              setHoverOpen(false);
              onNavigate?.();
            }}
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
  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: visibleNavItems(group.items, role),
  })).filter((group) => group.items.length > 0);
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
              src="/brand/logo-ce.png"
              alt="KMITL Computer Logo"
              className="h-full w-full object-contain object-left"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <Link href="/" className={linkClass}>
              Home
            </Link>
            {navGroups.map((group) => (
              <NavDropdown
                key={group.key}
                label={group.label}
                items={group.items}
                light={isQuiz}
              />
            ))}
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
            {navGroups.map((group) => (
              <NavDropdown
                key={group.key}
                label={group.label}
                items={group.items}
                mobileOpen={mobileDropdown === group.key}
                onToggleMobile={() =>
                  setMobileDropdown((d) => (d === group.key ? null : group.key))
                }
                onNavigate={closeMobile}
                light={isQuiz}
              />
            ))}
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
