import { ExamGuard } from "@/features/exam";

/**
 * exam/* — fullscreen Exit Exam
 * ไม่มี Navbar / Footer ของเว็บสาธารณะ
 */
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return <ExamGuard>{children}</ExamGuard>;
}
