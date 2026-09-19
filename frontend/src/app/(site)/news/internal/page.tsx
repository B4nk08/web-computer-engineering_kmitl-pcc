import { RequireMember } from "@/components/layout/require-member";
import { NewsListingView } from "@/features/news";

/** หน้า /news/internal — ประกาศภายในสาขา (เฉพาะผู้เข้าสู่ระบบ) */
export default function InternalNewsPage() {
  return (
    <RequireMember description="ประกาศภายในสาขา เช่น นัดประชุม เห็นเฉพาะนักศึกษาและบุคลากรที่เข้าสู่ระบบแล้ว">
      <NewsListingView audience="internal" />
    </RequireMember>
  );
}
