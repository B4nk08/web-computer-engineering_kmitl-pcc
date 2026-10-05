import { redirect } from "next/navigation";

/** เส้นทางเก่า /faculty/facultyce */
export default function FacultyCeRedirectPage() {
  redirect("/faculty");
}
