import { NewsListingView } from "@/features/news";

/** หน้า /news/internal — ข่าวภายในภาควิชา */
export default function InternalNewsPage() {
  return <NewsListingView audience="internal" />;
}
