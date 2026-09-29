import { HeroSection } from "@/features/home/hero-section";
import { LatestNewsSection } from "@/features/home/latest-news-section";
import { AboutUsSection } from "@/features/home/about-us-section";
import { CareerClustersSection } from "@/features/home/career-clusters-section";
import { StudentShowcaseFacultySection } from "@/features/home/student-showcase-faculty-section";
import { AdmissionsCtaSection } from "@/features/home/admissions-cta-section";
import { DotDivider, WaveDivider } from "@/features/home/section-divider";

/**
 * page.tsx (Home, route "/")
 * Hero -> ประกาศล่าสุด -> About Us -> เส้นทางอาชีพ -> Student Showcase & Faculty -> ชวนสมัคร
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestNewsSection />
      <AboutUsSection />
      <DotDivider />
      <CareerClustersSection />
      <WaveDivider from="white" to="surface" flip />
      <StudentShowcaseFacultySection />
      <WaveDivider from="surface" to="white" />
      <AdmissionsCtaSection />
    </>
  );
}
