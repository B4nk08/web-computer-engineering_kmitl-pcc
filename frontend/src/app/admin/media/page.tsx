import { ContentManager } from "@/features/content";

export default function MediaAdminPage() {
  return (
    <ContentManager
      type="video"
      title="รูปหรือวิดีโอแนะนำ"
      description="เพิ่ม แก้ไข หรือลบรูปหรือวิดีโอแนะนำ"
    />
  );
}
