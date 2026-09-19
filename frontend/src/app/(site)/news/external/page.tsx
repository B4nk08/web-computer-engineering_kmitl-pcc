import { redirect } from "next/navigation";

/** เดิม /news/external — รวมเข้าหน้าประกาศรับสมัครแล้ว */
export default function ExternalNewsRedirectPage() {
  redirect("/news");
}
