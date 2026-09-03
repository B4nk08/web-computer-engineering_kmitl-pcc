/**
 * showcase.ts
 * -----------
 * ข้อมูลตัวอย่าง (mock data) สำหรับส่วน "Student Showcase & Faculty"
 */

export interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  position: string;
}

export const studentShowcase: ShowcaseItem[] = [
  {
    id: "sc-1",
    title: "ระบบจองห้องเรียนอัจฉริยะ",
    subtitle: "โปรเจกต์จบ ชั้นปีที่ 4",
    detail:
      "แอปพลิเคชันจองห้องเรียน/ห้องประชุมแบบเรียลไทม์ พร้อมระบบแจ้งเตือนอัตโนมัติ พัฒนาโดยทีมนักศึกษาชั้นปีที่ 4",
  },
  {
    id: "sc-2",
    title: "หุ่นยนต์ตรวจจับสิ่งกีดขวาง",
    subtitle: "โครงงานวิศวกรรม ชั้นปีที่ 3",
    detail: "หุ่นยนต์อัตโนมัติที่ใช้เซนเซอร์ตรวจจับสิ่งกีดขวางและวางแผนเส้นทางเดินได้เอง",
  },
  {
    id: "sc-3",
    title: "แอปวิเคราะห์ผลการเรียน",
    subtitle: "รางวัลชนะเลิศ ค่ายแฮกกาธอน",
    detail:
      "เว็บแอปพลิเคชันช่วยวิเคราะห์และแสดงผลข้อมูลผลการเรียนของนักศึกษาในรูปแบบกราฟที่เข้าใจง่าย",
  },
];

export const facultyMembers: FacultyMember[] = [
  { id: "fac-1", name: "อ.ดร. สมชาย ใจดี", position: "หัวหน้าภาควิชา" },
  { id: "fac-2", name: "ผศ.ดร. สุนีย์ วัฒนกุล", position: "อาจารย์ประจำ" },
  { id: "fac-3", name: "อ. ธนกร ศรีสุข", position: "อาจารย์ประจำ" },
  { id: "fac-4", name: "ผศ. วิภา รักเรียน", position: "อาจารย์ประจำ" },
  { id: "fac-5", name: "อ.ดร. ปิยะ มั่นคง", position: "อาจารย์ประจำ" },
  { id: "fac-6", name: "อ. กมลชนก แสงทอง", position: "อาจารย์ประจำ" },
];
