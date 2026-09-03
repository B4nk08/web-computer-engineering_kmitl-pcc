import { ContentManager } from "@/features/content";

export default function ExitExamAdminPage() {
  return (
    <ContentManager
      type="exit_exam"
      title="Exit Exam"
      description="เพิ่ม แก้ไข หรือลบ Exit Exam (เฉพาะอาจารย์)"
    />
  );
}
