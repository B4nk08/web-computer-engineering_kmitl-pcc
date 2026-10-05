import type { QuizPlayDto } from "./api";
import type { PlayQuestion } from "./types";

/** แปลงคำถามจาก API เป็นรูปแบบที่ QuizFlow ใช้ */
export function toPlayQuestions(quiz: QuizPlayDto): PlayQuestion[] {
  return quiz.questions.map((question) => ({
    id: question.id,
    text: question.prompt,
    choices: question.options.map((option) => ({
      id: option.id,
      text: option.label,
    })),
  }));
}
