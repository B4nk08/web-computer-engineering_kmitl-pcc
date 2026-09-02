import { ExamGuard, ExamResultPage } from "@/features/exam";

export default function ExamResultRoute() {
  return (
    <ExamGuard>
      <ExamResultPage />
    </ExamGuard>
  );
}

