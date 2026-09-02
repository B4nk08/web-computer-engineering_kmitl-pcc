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
  { label: "หลักสูตร", href: "/beng" },
  { label: "คุณสมบัติ", href: "/admission-requirements" },
  { label: "กิจกรรม", href: "/#activities" },
];

export const ACADEMICS_ITEMS: NavItem[] = [
  { label: "Quizz", href: "/academics/quiz" },
  { label: "วิเคราะห์", href: "/academics/analysis" },
];

// เฉพาะบทบาท "member" (นักศึกษา/อาจารย์/แอดมิน)
export const FACUITY_ITEMS: NavItem[] = [
  { label: "Faculty", href: "/faculty" },
  { label: "รายชื่อชั้นปี", href: "/faculty/students-by-year" },
];

export const STUDENT_ITEMS: NavItem[] = [
  { label: "Quizz แนะนำ", href: "/student/quiz-recommend" },
  { label: "CE exit exam", href: "/student/ce-exit-exam" },
];
