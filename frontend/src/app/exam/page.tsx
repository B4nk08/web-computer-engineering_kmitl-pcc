import { ExamGuard, SubjectPicker } from "@/features/exam";

export default function ExamLandingPage() {
  return (
    <ExamGuard>
      <SubjectPicker />
    </ExamGuard>
  );
}
