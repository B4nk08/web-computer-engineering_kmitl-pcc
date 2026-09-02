import { ExamGuard, ExamSessionView } from "@/features/exam";

export default function ExamSessionPage() {
  return (
    <ExamGuard>
      <ExamSessionView />
    </ExamGuard>
  );
}
