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
  | "about_us"
  | "curriculum"
  | "staff"
  | "student_work"
  | "news"
  | "admissions"
  | "career_path"
  | "quiz"
  | "exit_exam";

export type StaffRole = "admin" | "teacher";

export type AdminNavGroupId = "public" | "external" | "system";

export type AdminNavItem = {
  title: string;
  href: string;
  /** ใส่เฉพาะหน้าที่ใช้ ContentManager (CRUD ตาราง contents) — หน้า custom อื่น ๆ ไม่ต้องใส่ */
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
    label: "Public",
    items: [
      {
        title: "ข้อมูลหลักสูตร",
        href: "/admin/curriculum",
        type: "curriculum",
        description: "เพิ่ม แก้ไข หรือลบข้อมูลหลักสูตร",
        icon: BookOpen,
      },
      {
        title: "บุคลากร",
        href: "/admin/staff",
        type: "staff",
        description: "เพิ่ม แก้ไข หรือลบบุคลากร",
        icon: Users,
      },
      {
        title: "ผลงานนักศึกษา",
        href: "/admin/student-works",
        type: "student_work",
        description: "เพิ่ม แก้ไข หรือลบผลงานนักศึกษา",
        icon: GraduationCap,
      },
      {
        title: "ข่าวสารทั่วไป",
        href: "/admin/news",
        type: "news",
        description: "เพิ่ม แก้ไข หรือลบข่าวสารทั่วไป",
        icon: Newspaper,
      },
      {
        title: "เกี่ยวกับเรา",
        href: "/admin/media",
        type: "about_us",
        description: "วิดีโอ รูปภาพ และคำอธิบายสั้น ๆ หน้า About Us",
        icon: Video,
      },
    ],
  },
  {
    id: "external",
    label: "External user",
    items: [
      {
        title: "จำนวนการรับสมัคร / ค่าเทอม",
        href: "/admin/admissions",
        type: "admissions",
        description: "เพิ่ม แก้ไข หรือลบข้อมูลรับสมัครและค่าเทอม",
        icon: ClipboardList,
      },
      {
        title: "เส้นทางอาชีพ",
        href: "/admin/careers",
        type: "career_path",
        description: "เพิ่ม แก้ไข หรือลบเส้นทางอาชีพ",
        icon: Briefcase,
      },
      {
        title: "Quiz",
        href: "/admin/quiz",
        type: "quiz",
        description: "จัดการแบบทดสอบ Quiz",
        icon: FileQuestion,
        roles: ["admin", "teacher"],
      },
      {
        title: "Exit Exam",
        href: "/admin/exit-exam",
        description: "จัดการกลุ่มข้อสอบและคลังคำถาม Exit Exam",
        icon: ScrollText,
        roles: ["teacher"],
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        title: "รายชื่อผู้มีสิทธิ์เข้าใช้งาน",
        href: "/admin/whitelist",
        description: "เพิ่มรายชื่อทีละคน หรือนำเข้าไฟล์ CSV เข้า ce_whitelist",
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
  return adminNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === href);
}
