import { ContentManager } from "@/features/content";

export default function StaffAdminPage() {
  return (
    <ContentManager
      type="staff"
      title="คณาจารย์ / บุคลากร"
      description="หน้าแรก → ส่วนบุคลากร — ชื่อ ตำแหน่ง รูป และประวัติสั้น ๆ"
    />
  );
}
