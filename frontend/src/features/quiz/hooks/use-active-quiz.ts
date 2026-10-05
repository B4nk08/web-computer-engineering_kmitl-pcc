"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { listQuizzes, playQuiz, type QuizPlayDto } from "../api";

/** โหลดควิซที่เปิดใช้งานอยู่หนึ่งชุด พร้อมคำถาม */
export function useActiveQuiz(kind: "internal" | "external", emptyMessage: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizPlayDto | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listQuizzes(kind, { isActive: true })
      .then((items) => {
        const active = items[0];
        if (!active) throw new Error(emptyMessage);
        return playQuiz(active.id);
      })
      .then((data) => {
        if (!alive) return;
        if (data.questions.length === 0) throw new Error(emptyMessage);
        setQuiz(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "โหลดแบบทดสอบไม่สำเร็จ",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [kind, emptyMessage]);

  return { loading, error, quiz };
}
