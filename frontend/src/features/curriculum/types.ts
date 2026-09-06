/** View-model สำหรับหน้าหลักสูตร (/beng) และ Home About Us */

export type CurriculumProgram = {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  pdfUrl: string;
  /** รูปด้านซ้ายในหน้าแรก (About Us) */
  aboutImageUrl: string;
  /** คำอธิบายเมื่อกดปุ่ม + บนรูป */
  aboutCaption: string;
  location: string;
  language: string;
  systemDescription: string;
  fields: { label: string; value: string }[];
  summary: { value: string; label: string }[];
};
