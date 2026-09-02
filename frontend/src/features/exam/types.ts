/** Exit Exam feature — types aligned with backend dto/exam.go */

export type ExamMode = "mock" | "real";

export type ExamSubjectDto = {
  id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ExamChoiceDto = {
  key: string;
  text: string;
};

export type ExamQuestionPlayItemDto = {
  id: string;
  prompt: string;
  image_url: string;
  choices: ExamChoiceDto[];
};

export type StartExamInput = {
  subject: string;
  mode: ExamMode;
  username?: string;
  password?: string;
};

export type ExamAttemptStartResponseDto = {
  attempt_id: string;
  subject: string;
  mode: string;
  time_limit_minutes?: number | null;
  started_at?: string | null;
  questions: ExamQuestionPlayItemDto[];
};

export type ExamAttemptResultDto = {
  attempt_id: string;
  subject: string;
  mode: string;
  score: number | null;
  max_score: number | null;
  status: string;
  submitted_at?: string | null;
};

/** สถานะของคำถามแต่ละข้อ ใช้กับ nav grid */
export type ExamQuestionStatus = "unanswered" | "answered";

/** สถานะ session ที่เก็บไว้ใน localStorage เพื่อกันข้อมูลหายตอน refresh */
export type StoredExamSession = {
  attemptId: string;
  subjectCode: string;
  subjectName: string;
  mode: ExamMode;
  timeLimitMinutes: number | null;
  startedAt: string | null;
  questions: ExamQuestionPlayItemDto[];
  answers: Record<string, string>;
  flagged: string[];
  step: "taking" | "review";
  currentPage: number;
};

export type StoredExamResult = ExamAttemptResultDto & {
  subjectName: string;
  /** จำนวนข้อที่ตอบ (ฝั่ง client เก็บไว้โชว์เพิ่ม) */
  answered_count?: number;
  /** จำนวนข้อทั้งหมดในชุดสอบ */
  question_count?: number;
};

/** ---------- สอบทุกหมวดหมู่พร้อมกัน (Combo) ---------- */

/** ผลของแต่ละหมวดหมู่ที่ทำเสร็จแล้วระหว่างสอบแบบ combo */
export type ComboSubjectResult = {
  subjectCode: string;
  subjectName: string;
  score: number | null;
  max_score: number | null;
  question_count?: number;
  answered_count?: number;
};

/** สถานะ combo ระหว่างทำ ใช้กันข้อมูลหายตอน refresh (เก็บคู่กับ StoredExamSession ของหมวดปัจจุบัน) */
export type StoredComboSession = {
  mode: ExamMode;
  subjects: { code: string; name: string }[];
  /** index ของหมวดที่กำลังทำอยู่ในขณะนี้ */
  currentIndex: number;
  /** ผลของหมวดที่ทำเสร็จแล้ว (ไม่รวมหมวดปัจจุบัน) */
  results: ComboSubjectResult[];
};

/** สรุปผลรวมหลังทำครบทุกหมวดหมู่แล้ว — ใช้คำนวณค่าเฉลี่ยแบบถ่วงน้ำหนักตามจำนวนข้อ */
export type StoredComboResult = {
  mode: ExamMode;
  results: ComboSubjectResult[];
  totalScore: number;
  totalMaxScore: number;
  /** เปอร์เซ็นต์เฉลี่ยรวม (ถ่วงน้ำหนักตามจำนวนข้อ) หรือ null ถ้าไม่มีคะแนนเลย */
  averagePercent: number | null;
};

/** ---------- Admin bank ---------- */

export type ExamChoiceAdminDto = {
  key: string;
  text: string;
  is_correct: boolean;
};

export type ExamQuestionAdminDto = {
  id: string;
  subject: string;
  mode: string;
  prompt: string;
  image_url: string;
  choices: ExamChoiceAdminDto[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateExamSubjectInput = {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
};

export type UpdateExamSubjectInput = {
  name?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type CreateExamQuestionInput = {
  subject: string;
  mode: ExamMode;
  prompt: string;
  image_url?: string;
  choices: ExamChoiceAdminDto[];
  is_active?: boolean;
};

export type UpdateExamQuestionInput = {
  prompt?: string;
  image_url?: string;
  choices?: ExamChoiceAdminDto[];
  is_active?: boolean;
};

export type ExamSettingDto = {
  id: string;
  subject: string;
  mode: string;
  question_count: number;
  time_limit_minutes?: number | null;
  is_enabled: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  updated_at: string;
};

export type UpsertExamSettingInput = {
  subject: string;
  mode: ExamMode;
  question_count: number;
  time_limit_minutes?: number | null;
  is_enabled?: boolean;
};
