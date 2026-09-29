import {
  blocksFromSection,
  emptyAdmissionSection,
  type AdmissionsInfo,
} from "./types";

/** เนื้อหาเริ่มต้นเมื่อยังไม่มีเรคอร์ด admissions ใน DB */
const defaultQualifications = {
  intro: "",
  heading: "",
  items: [
    "สำเร็จการศึกษาไม่ต่ำกว่ามัธยมศึกษาตอนปลายสายวิทยาศาสตร์-คณิตศาสตร์",
    "มีผลการเรียนเฉลี่ยสะสมเป็นไปตามเกณฑ์ที่คณะกำหนดในแต่ละรอบการรับสมัคร",
  ],
};

export const DEFAULT_ADMISSIONS: AdmissionsInfo = {
  id: "default",
  title: "หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์",
  titleEn: "Bachelor of Engineering Program in Computer Engineering",
  body: "",
  tuition: "",
  quota: "",
  applyUrl: "",
  qualificationsSection: defaultQualifications,
  documentsSection: emptyAdmissionSection(),
  qualifications: blocksFromSection(defaultQualifications),
  supportItems: [],
  documents: [],
};
