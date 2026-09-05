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
