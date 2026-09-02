import { ContentManager } from "@/features/content";

export default function StudentWorksAdminPage() {
  return (
    <ContentManager
      type="student_work"
      title="ผลงานนักศึกษา"
      description="เพิ่ม แก้ไข หรือลบผลงานนักศึกษา"
    />
  );
}
