/** Domain types สำหรับหน้า Home — แยกจาก DTO ของ content admin */

export type HomeStaffMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
};

export type HomeShowcaseItem = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  imageUrl: string;
};

/** สื่อใน Hero — จาก content type `video` */
export type HomeHeroMedia =
  | { kind: "video"; src: string; title: string }
  | { kind: "image"; src: string; title: string }
  | { kind: "youtube"; videoId: string; title: string };

/** กิจกรรมใน About Us — รูปปก + ลิงก์ Google Photos */
export type HomeActivity = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  googlePhotosUrl: string;
};
