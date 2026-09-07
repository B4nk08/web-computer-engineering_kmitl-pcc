import { NewsManager } from "@/features/news";

export default function NewsAdminPage() {
  return (
    <NewsManager
      title="ข่าวสาร"
      description="External = ประกาศสาธารณะ (เช่น TCAS) / Internal = ประกาศภายใน (เช่น รับน้อง)"
    />
  );
}
