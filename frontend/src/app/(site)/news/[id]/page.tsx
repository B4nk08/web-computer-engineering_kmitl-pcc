"use client";

import { useParams } from "next/navigation";
import { NewsDetailView } from "@/features/news";

/** หน้า /news/:id — รายละเอียดข่าว */
export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  if (!params?.id) return null;
  return <NewsDetailView id={params.id} />;
}
