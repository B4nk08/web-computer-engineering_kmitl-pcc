/**
 * nav-items.ts
 * ------------
 * โครงสร้างเมนูดรอปดาวน์ของ Navbar
 * roles ว่าง = ทุกคนเห็น (รวมผู้ที่ยังไม่เข้าสู่ระบบ)
 */

export interface NavItem {
  label: string;
  href: string;
  /** ถ้าระบุ ต้องมี role ตรงนี้ถึงจะเห็นเมนู */
  roles?: readonly string[];
}

export const CE_MEMBER_ROLES = ["student", "teacher", "admin"] as const;
export const STUDENT_ONLY_ROLES = ["student"] as const;
export const STAFF_ROLES = ["teacher", "admin"] as const;

export interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
}

/** เมนูหลักจัดตามกลุ่มผู้ใช้ — ตรงกับกลุ่มใน Admin sidebar */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "about",
    label: "About Us",
    items: [
      { label: "หลักสูตร", href: "/about-us/beng" },
      { label: "คณาจารย์", href: "/faculty/facultyce" },
      { label: "กิจกรรม", href: "/about-us/activities" },
      { label: "ผลงานนักศึกษา", href: "/about-us/student-works" },
    ],
  },
  {
    key: "admissions",
    label: "Admissions",
    items: [
      { label: "คุณสมบัติผู้สมัคร", href: "/about-us/admission-requirements" },
      { label: "แบบทดสอบความพร้อม", href: "/academics/quiz" },
      { label: "เส้นทางอาชีพ", href: "/about-us/careers" },
    ],
  },
  {
    key: "news",
    label: "News",
    items: [
      { label: "ประกาศรับสมัคร", href: "/news" },
      { label: "ประกาศภายในสาขา", href: "/news/internal", roles: CE_MEMBER_ROLES },
    ],
  },
  {
    key: "student",
    label: "Student",
    items: [
      { label: "แบบทดสอบค้นหาสายงาน", href: "/student/quiz-recommend", roles: CE_MEMBER_ROLES },
      { label: "ข้อสอบวัดความรู้", href: "/student/exam", roles: CE_MEMBER_ROLES },
      { label: "รายชื่อนักศึกษาแต่ละรุ่น", href: "/faculty/students-by-year", roles: CE_MEMBER_ROLES },
    ],
  },
];

export function visibleNavItems(
  items: NavItem[],
  role: string | null | undefined
): NavItem[] {
  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return Boolean(role && item.roles.includes(role));
  });
}