import { ExamGuard } from "@/features/exam";

/**
 * (site)/student/exam/* — Exit Exam ภายใต้ Navbar
 * เข้าจากเมนู Student > CE exit exam
 */
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return <ExamGuard>{children}</ExamGuard>;
}
