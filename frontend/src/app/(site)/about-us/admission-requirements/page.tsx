import { AdmissionsView } from "@/features/about-us";

/**
 * app/about-us/admission-requirements/page.tsx (route "/about-us/admission-requirements")
 * ดึงจาก API type=admissions (Admin → ข้อมูลรับสมัคร)
 */
export default function AdmissionRequirementsPage() {
  return <AdmissionsView />;
}
