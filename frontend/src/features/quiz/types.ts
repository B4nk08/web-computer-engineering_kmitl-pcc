/**
 * types.ts (quiz)
 * ----------------
 * โครงสร้างที่ใช้ร่วมใน QuizFlow ทั้งควิซแนะนำสาย (internal จาก API)
 * และควิซวัดความพร้อม (external จาก API)
 */

export type ChoiceId = "A" | "B" | "C" | "D";

export interface QuizChoice {
  id: ChoiceId;
  text: string;
  trackTag?: string;
  weight?: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  choices: QuizChoice[];
}

export type QuizAnswers = Record<number, ChoiceId>;

/** คำถามที่ QuizFlow ใช้จริง — id เป็น string เพื่อรองรับ UUID จาก API */
export type PlayQuestion = {
  id: string;
  text: string;
  choices: { id: string; text: string }[];
};

export type PlayAnswers = Record<string, string>;
