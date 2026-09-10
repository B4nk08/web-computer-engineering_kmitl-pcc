import { NewsManager } from "@/features/news";

export default function NewsAdminPage() {
  return (
    <NewsManager
      title="ข่าวสาร"
      description="หน้า /news — External = ประกาศสาธารณะ (เช่น TCAS) / Internal = ข่าวภายใน แยกจากกิจกรรม"
    />
  );
}
