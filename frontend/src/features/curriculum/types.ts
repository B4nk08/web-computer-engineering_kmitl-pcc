/** View-model สำหรับหน้าหลักสูตร (/beng) และ Home About Us */

export type CurriculumProgram = {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  pdfUrl: string;
  location: string;
  language: string;
  systemDescription: string;
  fields: { label: string; value: string }[];
  summary: { value: string; label: string }[];
};
