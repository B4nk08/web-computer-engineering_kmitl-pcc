"use client";

import { QuizFlow } from "@/features/quiz/quiz-flow";
import { GeneralQuizResult } from "@/features/quiz/general-quiz-result";
import { generalQuizQuestions } from "@/features/quiz/data/general-quiz-questions";

/**
 * app/academics/quiz/page.tsx (route "/academics/quiz")
 * ---------------------------------------------------------
 * "Quizz วัดความพร้อม" — เปิดให้บุคคลทั่วไป/นักเรียนทำได้ ไม่ต้องล็อกอิน
 */
export default function AcademicsQuizPage() {
  return (
    <QuizFlow
      questions={generalQuizQuestions}
      introQuote="อยากเรียนวิศวกรรมคอมพิวเตอร์ แต่ไม่รู้ว่าพร้อมหรือยัง ให้เราช่วยคุณ"
      introDescription={[
        "ไม่ต้องกังวลล่วงหน้าไปก่อนแม่น เก็บความพร้อมของคุณก่อนลงสนามจริง",
        "ทำแบบทดสอบเพื่อค้นหาว่าคุณพร้อมเข้าเรียนวิศวกรรมคอมพิวเตอร์แค่ไหน",
        "พร้อมคำแนะนำทักษะที่ควรเติมเต็มก่อนเริ่มต้น",
      ]}
      renderResult={({ answers, questions, onRetake }) => (
        <GeneralQuizResult answers={answers} questions={questions} onRetake={onRetake} />
      )}
    />
  );
}
