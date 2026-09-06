import { RoleProvider } from "@/hooks/use-role";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/**
 * (site) — หน้าเว็บสาธารณะเท่านั้น
 * มี Navbar + Footer — ไม่ครอบ auth / admin / exam
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />
      </div>
    </RoleProvider>
  );
}
