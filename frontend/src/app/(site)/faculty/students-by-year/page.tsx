import { RequireMember } from "@/components/layout/require-member";
import { StudentsByYearListingView } from "@/features/faculty";

// route "/faculty/students-by-year" — นักศึกษา/อาจารย์/แอดมินจาก ce_whitelist
export default function StudentsByYearPage() {
  return (
    <RequireMember description="หน้ารายชื่อชั้นปีเห็นเฉพาะนักศึกษาและบุคลากรสาขาที่เข้าสู่ระบบแล้ว">
      <StudentsByYearListingView />
    </RequireMember>
  );
}
