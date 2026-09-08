"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
 * หน้า Home: โปร่งทับวิดีโอตอนอยู่บนสุด → ทึบเมื่อเลื่อนลง
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
}: NavItem & { onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={() => {
        onNavigate?.();
        scrollToHash(href);
      }}
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
  href,
  items,
  mobileOpen,
  onToggleMobile,
  onNavigate,
}: {
  label: string;
  href?: string;
  items: NavItem[];
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
  onNavigate?: () => void;
}) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const isMobileControlled = mobileOpen !== undefined;
  const open = isMobileControlled ? mobileOpen : hoverOpen;

  const labelClass =
    "py-2 text-sm font-medium text-white/90 transition-colors hover:text-[var(--accent)] md:text-[15px]";

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
          className="flex items-center py-2 text-white/90 transition-colors hover:text-[var(--accent)]"
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
          "absolute left-0 top-full z-40 hidden w-52 origin-top rounded-xl bg-[var(--navy-950)]/95 p-2 shadow-xl ring-1 ring-white/10 backdrop-blur transition-all duration-150 md:block",
          open
            ? "visible translate-y-1 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {items.map((item) => (
          <DropdownItem key={item.label} {...item} onNavigate={onNavigate} />
        ))}
      </div>

      {isMobileControlled && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            open ? "max-h-60" : "max-h-0",
          )}
        >
          <div className="mt-1 space-y-1 rounded-lg bg-white/5 p-2">
            {items.map((item) => (
              <DropdownItem
                key={item.label}
                {...item}
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
  const solidNav = !isHome || scrolled || mobileMenuOpen;

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300",
          solidNav
            ? "bg-[var(--navy-950)] shadow-md"
            : "bg-gradient-to-b from-black/55 via-black/25 to-transparent shadow-none backdrop-blur-[2px]",
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

          <div className="hidden items-center gap-6 lg:gap-8 md:flex">
            <Link
              href="/"
              className="py-2 text-[15px] font-medium text-white/90 transition-colors hover:text-[var(--accent)]"
            >
              Home
            </Link>
            <NavDropdown
              label="About Us"
              href="/#about"
              items={ABOUT_US_ITEMS}
            />
            <NavDropdown label="Academics" items={ACADEMICS_ITEMS} />
            <NavDropdown label="Faculty" items={FACUITY_ITEMS} />
            <NavDropdown label="Student" items={STUDENT_ITEMS} />
          </div>

          <div className="flex shrink-0 items-center gap-3">
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
            "overflow-hidden bg-[var(--navy-950)] transition-all duration-200 md:hidden",
            mobileMenuOpen
              ? "max-h-[520px] border-t border-white/10"
              : "max-h-0",
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              onClick={closeMobile}
              className="py-2 text-[15px] font-medium text-white/90"
            >
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
            />
            <NavDropdown
              label="Faculty"
              items={FACUITY_ITEMS}
              mobileOpen={mobileDropdown === "faculty"}
              onToggleMobile={() =>
                setMobileDropdown((d) => (d === "faculty" ? null : "faculty"))
              }
              onNavigate={closeMobile}
            />
            <NavDropdown
              label="Student"
              items={STUDENT_ITEMS}
              mobileOpen={mobileDropdown === "student"}
              onToggleMobile={() =>
                setMobileDropdown((d) => (d === "student" ? null : "student"))
              }
              onNavigate={closeMobile}
            />
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

      {/* หน้า Home ไม่ใส่ spacer — ให้ hero เต็มจอใต้ navbar โปร่ง */}
      {!isHome ? <div className="h-16 shrink-0" aria-hidden /> : null}
    </>
  );
}
