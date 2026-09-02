import { apiClient, endpoints } from "@/lib/api";
import type {
  CreateExamQuestionInput,
  CreateExamSubjectInput,
  ExamAttemptResultDto,
  ExamAttemptStartResponseDto,
  ExamQuestionAdminDto,
  ExamSettingDto,
  ExamSubjectDto,
  StartExamInput,
  UpdateExamQuestionInput,
  UpdateExamSubjectInput,
  UpsertExamSettingInput,
} from "./types";

/** รายการกลุ่มวิชา — หน้านักศึกษาใช้เฉพาะ active, admin ใส่ includeInactive */
export async function listExamSubjects(includeInactive = false): Promise<ExamSubjectDto[]> {
  return apiClient<ExamSubjectDto[]>(endpoints.exams.subjects, {
    query: includeInactive ? { include_inactive: "true" } : undefined,
  });
}

export async function createExamSubject(
  input: CreateExamSubjectInput
): Promise<ExamSubjectDto> {
  return apiClient<ExamSubjectDto>(endpoints.exams.subjects, {
    method: "POST",
    body: {
      code: input.code.trim().toLowerCase(),
      name: input.name.trim(),
      description: input.description?.trim() || "",
      sort_order: input.sort_order ?? 0,
    },
  });
}

export async function updateExamSubject(
  id: string,
  input: UpdateExamSubjectInput
): Promise<ExamSubjectDto> {
  return apiClient<ExamSubjectDto>(endpoints.exams.subjectById(id), {
    method: "PUT",
    body: input,
  });
}

export async function deactivateExamSubject(id: string): Promise<void> {
  await apiClient(endpoints.exams.subjectById(id), { method: "DELETE" });
}

export async function listExamQuestions(opts?: {
  subject?: string;
  mode?: string;
  isActive?: boolean;
}): Promise<ExamQuestionAdminDto[]> {
  return apiClient<ExamQuestionAdminDto[]>(endpoints.exams.questions, {
    query: {
      subject: opts?.subject,
      mode: opts?.mode,
      is_active:
        opts?.isActive === undefined ? undefined : opts.isActive ? "true" : "false",
    },
  });
}

export async function createExamQuestion(
  input: CreateExamQuestionInput
): Promise<ExamQuestionAdminDto> {
  return apiClient<ExamQuestionAdminDto>(endpoints.exams.questions, {
    method: "POST",
    body: {
      subject: input.subject,
      mode: input.mode,
      prompt: input.prompt.trim(),
      image_url: input.image_url?.trim() || "",
      choices: input.choices,
      is_active: input.is_active ?? true,
    },
  });
}

export async function updateExamQuestion(
  id: string,
  input: UpdateExamQuestionInput
): Promise<ExamQuestionAdminDto> {
  return apiClient<ExamQuestionAdminDto>(endpoints.exams.questionById(id), {
    method: "PUT",
    body: input,
  });
}

export async function deleteExamQuestion(id: string): Promise<void> {
  await apiClient(endpoints.exams.questionById(id), { method: "DELETE" });
}

export async function listExamSettings(): Promise<ExamSettingDto[]> {
  return apiClient<ExamSettingDto[]>(endpoints.exams.settings);
}

export async function upsertExamSetting(
  input: UpsertExamSettingInput
): Promise<ExamSettingDto> {
  return apiClient<ExamSettingDto>(endpoints.exams.settings, {
    method: "PUT",
    body: {
      subject: input.subject,
      mode: input.mode,
      question_count: input.question_count,
      time_limit_minutes: input.time_limit_minutes ?? null,
      is_enabled: input.is_enabled ?? true,
    },
  });
}

/** เริ่มทำข้อสอบ — ได้ชุดคำถาม (สุ่มแล้ว) + attempt_id กลับมา */
export async function startExam(input: StartExamInput): Promise<ExamAttemptStartResponseDto> {
  return apiClient<ExamAttemptStartResponseDto>(endpoints.exams.start, {
    method: "POST",
    body: {
      subject: input.subject,
      mode: input.mode,
      username: input.username || undefined,
      password: input.password || undefined,
    },
  });
}

/** ส่งคำตอบครั้งเดียวเมื่อจบการสอบ (submit ซ้ำไม่ได้ — attempt จะถูกปิด) */
export async function submitExam(
  attemptId: string,
  answers: Record<string, string>
): Promise<ExamAttemptResultDto> {
  return apiClient<ExamAttemptResultDto>(endpoints.exams.submit(attemptId), {
    method: "POST",
    body: { answers },
  });
}
