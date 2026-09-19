import { NewsListingView } from "@/features/news";

/** หน้า /news — ประกาศรับสมัคร (ทุกคนเห็น) */
export default function NewsPage() {
  return <NewsListingView audience="external" />;
}
