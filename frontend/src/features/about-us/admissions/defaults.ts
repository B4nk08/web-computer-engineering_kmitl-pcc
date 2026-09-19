import type { AdmissionsInfo } from "./types";

/** เนื้อหาเริ่มต้นเมื่อยังไม่มีเรคอร์ด admissions ใน DB */
export const DEFAULT_ADMISSIONS: AdmissionsInfo = {
  id: "default",
  title: "หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์",
  titleEn: "Bachelor of Engineering Program in Computer Engineering",
  body: "",
  tuition: "",
  quota: "",
  applyUrl: "",
  qualifications: [
    "สำเร็จการศึกษาไม่ต่ำกว่ามัธยมศึกษาตอนปลายสายวิทยาศาสตร์-คณิตศาสตร์",
    "มีผลการเรียนเฉลี่ยสะสมเป็นไปตามเกณฑ์ที่คณะกำหนดในแต่ละรอบการรับสมัคร",
  ],
  supportItems: [],
  documents: [],
};
