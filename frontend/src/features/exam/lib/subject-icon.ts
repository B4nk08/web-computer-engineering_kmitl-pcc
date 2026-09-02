import {
  BookOpenCheck,
  Cpu,
  Network,
  ShieldCheck,
  SquareCode,
  Terminal,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/** เดา icon จาก code กลุ่มวิชา — ถ้าไม่รู้จักใช้ icon กลาง ๆ */
export function getSubjectIcon(code: string): LucideIcon {
  const key = code.toLowerCase();
  if (key.includes("iot")) return Wifi;
  if (key.includes("software") || key.includes("web")) return SquareCode;
  if (key.includes("network")) return Network;
  if (key.includes("program")) return Terminal;
  if (key.includes("security") || key.includes("cyber")) return ShieldCheck;
  if (key.includes("hardware") || key.includes("embed")) return Cpu;
  return BookOpenCheck;
}
