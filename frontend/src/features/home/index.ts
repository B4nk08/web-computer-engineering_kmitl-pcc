export { HeroSection } from "./hero-section";
export { AboutUsSection } from "./about-us-section";
export { StudentShowcaseFacultySection } from "./student-showcase-faculty-section";
export {
  fetchHomeStaff,
  fetchHomeShowcase,
  fetchHomeActivities,
  fetchHomeCurriculum,
  fetchHomeHeroMedia,
} from "./api";
export {
  useHomeStaff,
  useHomeShowcase,
  useHomeActivities,
  useHomeCurriculum,
  useHomeHeroMedia,
} from "./hooks/use-home-contents";
export type {
  HomeStaffMember,
  HomeShowcaseItem,
  HomeHeroMedia,
  HomeActivity,
} from "./types";
