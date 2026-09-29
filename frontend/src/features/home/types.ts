import type { ActivityItem } from "@/features/about-us/activities/types";
import type { StudentWork } from "@/features/about-us/student-works/types";

/** Domain types สำหรับหน้า Home — แยกจาก DTO ของ content admin */

export type StaffEducationLevel = "bachelor" | "master" | "doctorate";

export type StaffEducation = {
  level: StaffEducationLevel;
  degree: string;
  institution: string;
  year: string;
};

export type HomeStaffMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  education: StaffEducation[];
};

export type HomeShowcaseItem = StudentWork;
export type HomeActivity = ActivityItem;

/** สื่อใน Hero — จาก content type `video` */
export type HomeHeroMedia =
  | { kind: "video"; src: string; title: string }
  | { kind: "image"; src: string; title: string }
  | { kind: "youtube"; videoId: string; title: string };
