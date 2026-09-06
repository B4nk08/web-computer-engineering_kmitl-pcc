import { HeroSection } from "@/features/home/hero-section";
import { AboutUsSection } from "@/features/home/about-us-section";
import { StudentShowcaseFacultySection } from "@/features/home/student-showcase-faculty-section";

/**
 * page.tsx (Home, route "/")
 * Hero -> About Us (รวมช่องข่าวสาร) -> Student Showcase & Faculty
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutUsSection />
      <StudentShowcaseFacultySection />
    </>
  );
}
