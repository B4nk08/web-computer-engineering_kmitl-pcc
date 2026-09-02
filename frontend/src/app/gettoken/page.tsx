import type { Metadata } from "next";
import { GetTokenView } from "@/features/auth/components/get-token-view";

export const metadata: Metadata = {
  title: "Get Token | CE KMITL-PCC",
  robots: { index: false, follow: false },
};

export default function GetTokenPage() {
  return <GetTokenView />;
}
