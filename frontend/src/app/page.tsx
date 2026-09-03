import { HeroSection } from "@/features/home/hero-section";
import { AboutUsSection } from "@/features/home/about-us-section";
import { StudentShowcaseFacultySection } from "@/features/home/student-showcase-faculty-section";

/**
 * page.tsx (Home, route "/")
 * ---------------------------
 * หน้ายาวหน้าเดียวรวม 3 ส่วนตามสเปค: Hero -> About Us (+ กิจกรรม) -> Student Showcase & Faculty
 * เหมือนกันทั้งบทบาท guest และ member ต่างกันแค่เมนู Navbar (ดูใน components/layout/navbar.tsx)
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
