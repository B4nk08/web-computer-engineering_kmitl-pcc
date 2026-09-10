import { NewsListingView } from "@/features/news";

/** หน้า /news/external — ประกาศภายนอก เช่น TCAS */
export default function ExternalNewsPage() {
  return <NewsListingView audience="external" />;
}
