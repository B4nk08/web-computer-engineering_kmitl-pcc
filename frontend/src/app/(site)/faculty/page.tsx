import { redirect } from "next/navigation";

/** /faculty → หน้า Faculty CE */
export default function FacultyIndexPage() {
  redirect("/faculty/facultyce");
}
