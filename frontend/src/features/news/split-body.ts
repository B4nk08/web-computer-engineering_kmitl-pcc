/** แยกเนื้อหาประกาศเป็นบรรทัด — ตามขึ้นบรรทัดใหม่ หรือตามอิโมจิขึ้นต้นข้อ */
export function splitNewsBody(body: string): string[] {
  const trimmed = body.replace(/\r\n/g, "\n").trim();
  if (!trimmed) return [];

  if (trimmed.includes("\n")) {
    return trimmed
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const byEmoji = trimmed
    .split(/(?=\p{Extended_Pictographic})/u)
    .map((line) => line.trim())
    .filter(Boolean);

  return byEmoji.length > 1 ? byEmoji : [trimmed];
}
