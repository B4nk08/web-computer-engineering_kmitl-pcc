import { SiteShell } from "@/components/layout/site-shell";

/**
 * (site) — หน้าเว็บสาธารณะ (รวม Exit Exam)
 * มี Navbar — Footer ซ่อนบนหน้า exam / quiz เพราะเป็นหน้าเต็มจอ
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
