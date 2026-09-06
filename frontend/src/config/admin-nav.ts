import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  FileQuestion,
  GraduationCap,
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
  | "quiz"
  | "exit_exam";

export type StaffRole = "admin" | "teacher";

export type AdminNavGroupId = "public" | "external" | "system";

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
          "หน้าแรก → About Us — ข้อความหลักสูตร ตัวเลขสรุป รูปด้านซ้าย และหน้าหลักสูตร",
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
        title: "ข่าวสารหน้าแรก",
        href: "/admin/news",
        type: "news",
        description:
          "หน้าแรก → ใต้ About Us — ข่าว External โชว์สาธารณะ / Internal สำหรับภายใน",
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
        description: "หน้าแรก → ส่วนผลงานนักศึกษา — ชื่อผลงาน รายละเอียด และรูป",
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
        description: "หน้าคุณสมบัติผู้สมัคร — จำนวนรับ ค่าเทอม และข้อมูลรับเข้า",
        icon: ClipboardList,
      },
      {
        title: "เส้นทางอาชีพ",
        href: "/admin/careers",
        type: "career_path",
        description: "หน้าเส้นทางอาชีพ — อาชีพหลังจบการศึกษา",
        icon: Briefcase,
      },
      {
        title: "Quiz แนะนำ",
        href: "/admin/quiz",
        type: "quiz",
        description: "แบบทดสอบสำหรับผู้สนใจ — จัดการคำถามและผลประเมิน",
        icon: FileQuestion,
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
