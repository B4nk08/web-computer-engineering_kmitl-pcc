import { ContentManager } from "@/features/content";

export default function CurriculumAdminPage() {
  return (
    <ContentManager
      type="curriculum"
      title="ข้อมูลหลักสูตร"
      description="เพิ่ม แก้ไข หรือลบข้อมูลหลักสูตร"
    />
  );
}
