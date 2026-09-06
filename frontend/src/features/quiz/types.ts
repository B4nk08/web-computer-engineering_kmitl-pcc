/**
 * types.ts (quiz)
 * ----------------
 * โครงสร้างข้อมูลกลางที่ใช้ร่วมกันทั้ง 2 แบบทดสอบ:
 *  - Quizz แนะนำสาย (นักศึกษา, ต้องล็อกอิน)   -> /student/quiz-recommend
 *  - Quizz วัดความพร้อม (บุคคลทั่วไป)          -> /academics/quiz
 *
 * หมายเหตุ: ตามคำสั่งงาน ส่วนนี้เป็น Frontend อย่างเดียว ไม่มี backend
 * คำถาม/ตัวเลือกทั้งหมดจึงเป็นข้อมูลในไฟล์ src/features/quiz/data/*.ts
 * (ไม่ได้ดึงจาก API เหมือนส่วน Home/B.Eng/Admission ที่ทำไปก่อนหน้า)
 * ถ้าภายหลังต้องการต่อ backend จริง สามารถแทนที่การ import data ในหน้า
 * page.tsx ด้วยฟังก์ชันเรียก API ในสไตล์เดียวกับ src/lib/api/*.ts ได้เลย
 * โดยไม่ต้องแก้ไฟล์ quiz-flow.tsx
 */

export type ChoiceId = "A" | "B" | "C" | "D";

export interface QuizChoice {
  id: ChoiceId;
  text: string;
  /** ใช้กับควิซ "แนะนำสาย": แต่ละตัวเลือกโหวตให้สายอาชีพ/สายวิชาไหน */
  trackTag?: string;
  /** ใช้กับควิซ "วัดความพร้อม": น้ำหนักคะแนนของตัวเลือกนี้ (ยิ่งมากยิ่งพร้อม) */
  weight?: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  choices: QuizChoice[];
}

export type QuizAnswers = Record<number, ChoiceId>;
