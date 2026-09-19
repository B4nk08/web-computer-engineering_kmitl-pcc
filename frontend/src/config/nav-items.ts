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

export const ABOUT_US_ITEMS: NavItem[] = [
  { label: "หลักสูตร", href: "/about-us/beng" },
  { label: "คุณสมบัติ", href: "/about-us/admission-requirements" },
  { label: "เส้นทางอาชีพ", href: "/about-us/careers" },
  { label: "กิจกรรม", href: "/about-us/activities" },
  { label: "ผลงานนักศึกษา", href: "/about-us/student-works" },
];

export const NEWS_PUBLIC_ITEMS: NavItem[] = [
  { label: "ประกาศรับสมัคร", href: "/news" },
];

export const NEWS_MEMBER_ITEMS: NavItem[] = [
  {
    label: "ประกาศภายในสาขา",
    href: "/news/internal",
    roles: CE_MEMBER_ROLES,
  },
];

export const NEWS_ITEMS: NavItem[] = [...NEWS_PUBLIC_ITEMS, ...NEWS_MEMBER_ITEMS];

export const ACADEMICS_ITEMS: NavItem[] = [
  { label: "Quizz", href: "/academics/quiz" },
];

export const FACULTY_ITEMS: NavItem[] = [
  { label: "Faculty", href: "/faculty/facultyce" },
  {
    label: "รายชื่อชั้นปี",
    href: "/faculty/students-by-year",
    roles: CE_MEMBER_ROLES,
  },
];

export const STUDENT_ITEMS: NavItem[] = [
  {
    label: "Quizz แนะนำ",
    href: "/student/quiz-recommend",
    roles: CE_MEMBER_ROLES,
  },
  {
    label: "CE exit exam",
    href: "/student/exam",
    roles: CE_MEMBER_ROLES,
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

/** @deprecated ใช้ FACULTY_ITEMS */
export const FACUITY_ITEMS = FACULTY_ITEMS;
