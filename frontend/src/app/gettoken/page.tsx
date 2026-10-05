import { redirect } from "next/navigation";

/** เส้นทางเก่า /gettoken */
export default function GetTokenRedirectPage() {
  redirect("/get-token");
}
