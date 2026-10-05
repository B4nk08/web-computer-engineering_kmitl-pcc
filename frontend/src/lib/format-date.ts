type ThaiDateStyle = "medium" | "long" | "weekday" | "datetime";

const OPTIONS: Record<ThaiDateStyle, Intl.DateTimeFormatOptions> = {
  medium: { dateStyle: "medium" },
  long: { dateStyle: "long" },
  weekday: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  datetime: { dateStyle: "medium", timeStyle: "short" },
};

/** วันที่ภาษาไทย ใช้ร่วมทั้งเว็บ — คืนค่าว่างถ้าไม่มีวันที่ และคืนสตริงเดิมถ้าแปลงไม่ได้ */
export function formatThaiDate(
  iso?: string | Date | null,
  style: ThaiDateStyle = "medium",
): string {
  if (!iso) return "";
  try {
    const date = iso instanceof Date ? iso : new Date(iso);
    return new Intl.DateTimeFormat("th-TH", OPTIONS[style]).format(date);
  } catch {
    return typeof iso === "string" ? iso : "";
  }
}
