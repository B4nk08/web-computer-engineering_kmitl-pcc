/** จำนวนคำถามต่อหน้าตอนทำข้อสอบ */
export const QUESTIONS_PER_PAGE = 6;

export function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
