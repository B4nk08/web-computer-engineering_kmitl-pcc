/**
 * nav-items.ts
 * ------------
 * โครงสร้างเมนูดรอปดาวน์ทั้งหมดของ Navbar แยกออกมาเป็นไฟล์ config
 * เพื่อให้แก้ไข/เพิ่มเมนูได้ง่าย โดยไม่ต้องแตะโค้ด component โดยตรง
 */

export interface NavItem {
  label: string;
  href: string;
}

export const ABOUT_US_ITEMS: NavItem[] = [
  { label: "หลักสูตร", href: "/about-us/beng" },
  { label: "คุณสมบัติ", href: "/about-us/admission-requirements" },
  { label: "เส้นทางอาชีพ", href: "/about-us/careers" },
  { label: "กิจกรรม", href: "/about-us/activities" },
  { label: "ผลงานนักศึกษา", href: "/about-us/student-works" },
];

export const NEWS_ITEMS: NavItem[] = [
  { label: "ทั้งหมด", href: "/news" },
  { label: "ประกาศภายนอก", href: "/news/external" },
  { label: "ข่าวภายใน", href: "/news/internal" },
];

export const ACADEMICS_ITEMS: NavItem[] = [
  { label: "Quizz", href: "/academics/quiz" },
  { label: "วิเคราะห์", href: "/academics/analysis" },
];

// เฉพาะบทบาท "member" (นักศึกษา/อาจารย์/แอดมิน)
export const FACUITY_ITEMS: NavItem[] = [
  { label: "Faculty", href: "/faculty/facultyce" },
  { label: "รายชื่อชั้นปี", href: "/faculty/students-by-year" },
];

export const STUDENT_ITEMS: NavItem[] = [
  { label: "Quizz แนะนำ", href: "/student/quiz-recommend" },
  { label: "CE exit exam", href: "/student/exam" },
];
