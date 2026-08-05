import { ContentManager } from "@/features/content";

export default function AdmissionsAdminPage() {
  return (
    <ContentManager
      type="admissions"
      title="จำนวนการรับสมัคร / ค่าเทอม"
      description="เพิ่ม แก้ไข หรือลบข้อมูลรับสมัครและค่าเทอม"
    />
  );
}
