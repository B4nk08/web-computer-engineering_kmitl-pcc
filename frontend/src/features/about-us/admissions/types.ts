/** View-model สำหรับหน้าคุณสมบัติผู้สมัคร (/about-us/admission-requirements) */

export type SupportItem = {
  title: string;
  detail: string;
};

export type AdmissionsInfo = {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  tuition: string;
  quota: string;
  applyUrl: string;
  qualifications: string[];
  supportItems: SupportItem[];
  documents: string[];
};
