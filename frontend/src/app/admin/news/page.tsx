import { ContentManager } from "@/features/content";

export default function NewsAdminPage() {
  return (
    <ContentManager
      type="news"
      title="ข่าวสารทั่วไป"
      description="เพิ่ม แก้ไข หรือลบข่าวสารทั่วไป"
    />
  );
}
