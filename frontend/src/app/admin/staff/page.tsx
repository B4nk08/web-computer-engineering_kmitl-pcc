import { ContentManager } from "@/features/content";

export default function StaffAdminPage() {
  return (
    <ContentManager
      type="staff"
      title="บุคลากร"
      description="เพิ่ม แก้ไข หรือลบบุคลากร"
    />
  );
}
