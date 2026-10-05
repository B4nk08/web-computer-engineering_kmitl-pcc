import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** ไอคอนหมุนพร้อมข้อความ ใช้ตอนรอข้อมูลจาก API */
export function LoadingRow({
  label = "กำลังโหลด...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <Loader2 className="size-5 animate-spin text-[var(--navy-900)]" aria-hidden />
      <span className="ml-2 text-sm text-[var(--ink-soft)]">{label}</span>
    </div>
  );
}
