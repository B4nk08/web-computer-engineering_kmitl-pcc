"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RoleProvider } from "@/hooks/use-role";

/** หน้า exam ออกแบบเต็มพื้นที่ — ไม่โชว์ Footer เพื่อไม่ให้เหลือช่องขาว */
function shouldHideFooter(pathname: string) {
  return pathname.startsWith("/student/exam");
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = shouldHideFooter(pathname);

  return (
    <RoleProvider>
      <div className="min-h-svh">
        <Navbar />
        <main className="min-w-0">{children}</main>
        {hideFooter ? null : <Footer />}
      </div>
    </RoleProvider>
  );
}
