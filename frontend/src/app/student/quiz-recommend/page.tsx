"use client";

import { RequireMember } from "@/components/layout/require-member";
import { QuizFlow } from "@/features/quiz/quiz-flow";
import { StudentQuizResult } from "@/features/quiz/student-quiz-result";
import { studentQuizQuestions } from "@/features/quiz/data/student-quiz-questions";

/**
 * app/student/quiz-recommend/page.tsx (route "/student/quiz-recommend")
 * -------------------------------------------------------------------------
 * "Quizz แนะนำสาย" — เฉพาะนักศึกษาที่เข้าสู่ระบบแล้วเท่านั้น (ดู RequireMember)
 * เมนูนี้ก็จะไม่ถูกแสดงใน Navbar เลยถ้ายังไม่ได้ล็อกอิน (ดู components/layout/navbar.tsx)
 * แต่ยังคง guard ไว้ที่หน้านี้ด้วย เผื่อผู้ใช้เข้าตรงผ่าน URL
 */
export default function StudentQuizRecommendPage() {
  return (
    <RequireMember>
      <QuizFlow
        questions={studentQuizQuestions}
        introQuote="เรียนมาสักพักแล้ว แต่ยังไม่รู้จะไปทางไหนดี มารวมกันตรงนี้"
        introDescription={[
          "เพียง 5 นาที มาค้นหา DNA เขียนโค้ด ต่อวงจร หรือ AI",
          "ไม่ต้องเดาให้ปวดหัว ลองทำแบบทดสอบสั้นๆ แล้วเราจะให้คำตอบที่ใช่ที่สุดสำหรับคุณ",
        ]}
        renderResult={({ answers, questions, onRetake }) => (
          <StudentQuizResult answers={answers} questions={questions} onRetake={onRetake} />
        )}
      />
    </RequireMember>
  );
}
