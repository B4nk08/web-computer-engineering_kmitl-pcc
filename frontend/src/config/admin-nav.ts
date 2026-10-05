import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Compass,
  FileQuestion,
  GraduationCap,
  History,
  Newspaper,
  ScrollText,
  UserCog,
  Users,
  Video,
} from "lucide-react";

export type ContentType =
  | "page"
  | "staff"
  | "student_work"
  | "news"
  | "video"
  | "admissions"
  | "career_path"
  | "curriculum"
  | "activity"
  | "quiz"
  | "exit_exam";

export type StaffRole = "admin" | "teacher";

export type AdminNavGroupId = "public" | "external" | "student" | "system";

export type AdminNavItem = {
  title: string;
  href: string;
  /** ใช้กับ ContentManager — รายการที่ไม่ใช่ content (เช่น whitelist) ไม่ต้องมี */
  type?: ContentType;
  description: string;
  icon: LucideIcon;
  /** ถ้าไม่ระบุ = ทั้ง admin และ teacher เห็น */
  roles?: StaffRole[];
  disabled?: boolean;
  disabledHint?: string;
};

export type AdminNavGroup = {
  id: AdminNavGroupId;
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "public",
    label: "หน้าเว็บสาธารณะ",
    items: [
      {
        title: "About Us / หลักสูตร",
        href: "/admin/curriculum",
        type: "curriculum",
        description:
          "หน้า /about-us/beng เป็น listing หลักสูตร · รูป About Us ใช้บนหน้าแรก",
        icon: BookOpen,
      },
      {
        title: "วิดีโอหน้าแรก",
        href: "/admin/media",
        type: "video",
        description: "หน้าแรก → ด้านบนสุด — อัปโหลดวิดีโอหรือรูปแนะนำภาควิชา",
        icon: Video,
      },
      {
        title: "กิจกรรม",
        href: "/admin/activities",
        type: "activity",
        description:
          "หน้าแรก → About Us และหน้า /about-us/activities — รูปปก + ลิงก์ Google Photos",
        icon: CalendarDays,
      },
      {
        title: "ข่าวสาร",
        href: "/admin/news",
        type: "news",
        description:
          "หน้า /news = ประกาศรับสมัคร (ทุกคนเห็น) · /news/internal = ประกาศภายในสาขา (ล็อกอิน)",
        icon: Newspaper,
      },
      {
        title: "คณาจารย์ / บุคลากร",
        href: "/admin/staff",
        type: "staff",
        description: "หน้าแรก → ส่วนบุคลากร — ชื่อ ตำแหน่ง รูป และประวัติสั้น ๆ",
        icon: Users,
      },
      {
        title: "ผลงานนักศึกษา",
        href: "/admin/student-works",
        type: "student_work",
        description: "หน้าแรก → Student Showcase และหน้า /about-us/student-works — รูป รายละเอียด และลิงก์เข้าใช้งาน",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "external",
    label: "สำหรับผู้สนใจเข้าศึกษา",
    items: [
      {
        title: "ข้อมูลรับสมัคร",
        href: "/admin/admissions",
        type: "admissions",
        description: "หนึ่งรายการต่อรอบรับสมัคร เช่น TCAS 1 Portfolio, โควตา",
        icon: ClipboardList,
      },
      {
        title: "เส้นทางอาชีพ",
        href: "/admin/careers",
        type: "career_path",
        description: "หน้า /about-us/careers — อาชีพหลังจบการศึกษา",
        icon: Briefcase,
      },
      {
        title: "Quiz วัดความพร้อม",
        href: "/admin/quiz",
        type: "quiz",
        description:
          "หน้า /academics/quiz — แบบทดสอบสำหรับบุคคลทั่วไป แต่ละตัวเลือกมีน้ำหนัก 0–3",
        icon: FileQuestion,
        roles: ["admin", "teacher"],
      },
    ],
  },
  {
    id: "student",
    label: "สำหรับนักศึกษา",
    items: [
      {
        title: "Quiz แนะนำสาย",
        href: "/admin/quiz-recommend",
        type: "quiz",
        description:
          "หน้า /student/quiz-recommend — แบบทดสอบแนะนำสายงานสำหรับนักศึกษาที่ล็อกอินแล้ว",
        icon: Compass,
        roles: ["admin", "teacher"],
      },
      {
        title: "Exit Exam",
        href: "/admin/exit-exam",
        type: "exit_exam",
        description: "ข้อสอบ Exit Exam สำหรับนักศึกษา — กลุ่มข้อสอบและคลังคำถาม",
        icon: ScrollText,
        roles: ["teacher"],
      },
    ],
  },
  {
    id: "system",
    label: "ตั้งค่าระบบ",
    items: [
      {
        title: "บันทึกการแก้ไข",
        href: "/admin/activity",
        description: "รายการที่เพิ่มหรือลบเนื้อหาและข่าวสารล่าสุด",
        icon: History,
        roles: ["admin", "teacher"],
      },
      {
        title: "รายชื่อผู้เข้าใช้ระบบ",
        href: "/admin/whitelist",
        description: "กำหนดอีเมลที่สมัคร/ล็อกอินในฐานะสมาชิก CE ได้ (เพิ่มทีละคนหรือนำเข้า CSV)",
        icon: UserCog,
        roles: ["admin", "teacher"],
      },
    ],
  },
];

export function canAccessNavItem(item: AdminNavItem, role: StaffRole): boolean {
  if (!item.roles || item.roles.length === 0) {
    return true;
  }
  return item.roles.includes(role);
}

export function findAdminNavItem(href: string): AdminNavItem | undefined {
  return adminNavGroups.flatMap((group) => group.items).find((item) => item.href === href);
}
