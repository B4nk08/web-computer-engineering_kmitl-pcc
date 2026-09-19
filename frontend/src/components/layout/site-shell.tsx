"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** หน้า exam/quiz ออกแบบเต็มพื้นที่ — ไม่โชว์ Footer เพื่อไม่ให้เหลือช่องขาว */
function shouldHideFooter(pathname: string) {
  return (
    pathname.startsWith("/student/exam") ||
    pathname.startsWith("/academics/quiz") ||
    pathname.startsWith("/student/quiz-recommend")
  );
}

function isQuizPath(pathname: string) {
  return (
    pathname.startsWith("/academics/quiz") ||
    pathname.startsWith("/student/quiz-recommend")
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = shouldHideFooter(pathname);
  const quizCanvas = isQuizPath(pathname);

  return (
    <div className={`flex min-h-svh flex-col${quizCanvas ? " quiz-canvas" : ""}`}>
      <Navbar />
      <main className={hideFooter ? "flex min-w-0 flex-1 flex-col" : "min-w-0"}>
        {children}
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
