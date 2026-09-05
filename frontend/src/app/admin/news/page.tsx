import { NewsManager } from "@/features/news";

export default function NewsAdminPage() {
  return (
    <NewsManager
      title="ข่าวสาร"
      description="แยก External (หน้าเว็บสาธารณะ) กับ Internal (ข่าวภายใน) ตอนสร้าง"
    />
  );
}
