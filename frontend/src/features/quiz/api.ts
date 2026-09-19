import { apiClient, endpoints } from "@/lib/api";

export type CareerClusterDto = {
  code: string;
  name: string;
  name_en: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export type CareerBriefDto = {
  id: string;
  title: string;
  role: string;
  detail: string;
  image_url: string;
};

export type ClusterScoreDto = {
  code: string;
  name: string;
  name_en: string;
  description: string;
  score: number;
  percent: number;
  careers?: CareerBriefDto[];
};

export type InternalQuizResultDto = {
  kind: string;
  question_count: number;
  answered_count: number;
  is_close: boolean;
  recommended_code?: string;
  clusters: ClusterScoreDto[];
};

export type ExternalQuizResultDto = {
  kind: string;
  question_count: number;
  answered_count: number;
  score: number;
  max_score: number;
  percent: number;
  band: string;
};

export type QuizResultDto = InternalQuizResultDto | ExternalQuizResultDto;

export function isInternalQuizResult(
  result: QuizResultDto | null | undefined
): result is InternalQuizResultDto {
  return Boolean(result && result.kind === "internal" && "clusters" in result);
}

export function isExternalQuizResult(
  result: QuizResultDto | null | undefined
): result is ExternalQuizResultDto {
  return Boolean(result && result.kind === "external" && "percent" in result);
}

export type QuizSummaryDto = {
  id: string;
  kind: string;
  slug?: string | null;
  title: string;
  description: string;
  question_count: number;
  is_active: boolean;
};

export type QuizPlayOptionDto = {
  id: string;
  label: string;
  sort_order: number;
};

export type QuizPlayQuestionDto = {
  id: string;
  prompt: string;
  image_url: string;
  sort_order: number;
  options: QuizPlayOptionDto[];
};

export type QuizPlayDto = {
  quiz: QuizSummaryDto;
  questions: QuizPlayQuestionDto[];
};

export type QuizAttemptDto = {
  id: string;
  quiz_id: string;
  user_id?: string | null;
  result?: QuizResultDto;
  recommended_track?: string | null;
  completed_at?: string | null;
};

export async function listCareerClusters(): Promise<CareerClusterDto[]> {
  return apiClient<CareerClusterDto[]>(endpoints.careerClusters);
}

export type QuizOptionAdminDto = {
  id: string;
  label: string;
  score_map?: Record<string, number> | null;
  sort_order: number;
};

export type QuizQuestionAdminDto = {
  id: string;
  prompt: string;
  image_url: string;
  sort_order: number;
  options: QuizOptionAdminDto[];
};

export type QuizDetailAdminDto = {
  quiz: QuizSummaryDto;
  questions: QuizQuestionAdminDto[];
};

export async function listQuizzes(
  kind: "internal" | "external",
  opts?: { isActive?: boolean }
): Promise<QuizSummaryDto[]> {
  return apiClient<QuizSummaryDto[]>(endpoints.quizzes.list, {
    query: { kind, is_active: opts?.isActive },
  });
}

export async function getQuizAdmin(id: string): Promise<QuizDetailAdminDto> {
  return apiClient<QuizDetailAdminDto>(endpoints.quizzes.byId(id));
}

export async function createQuiz(input: {
  kind: "internal" | "external";
  title: string;
  description?: string;
  question_count?: number;
  is_active?: boolean;
}): Promise<QuizSummaryDto> {
  return apiClient<QuizSummaryDto>(endpoints.quizzes.list, {
    method: "POST",
    body: input,
  });
}

export async function updateQuiz(
  id: string,
  input: { title?: string; description?: string; question_count?: number; is_active?: boolean }
): Promise<QuizSummaryDto> {
  return apiClient<QuizSummaryDto>(endpoints.quizzes.byId(id), {
    method: "PUT",
    body: input,
  });
}

export async function addQuizQuestion(
  quizId: string,
  input: {
    prompt: string;
    sort_order?: number;
    options: { label: string; score_map: Record<string, number>; sort_order: number }[];
  }
): Promise<QuizQuestionAdminDto> {
  return apiClient<QuizQuestionAdminDto>(endpoints.quizzes.questions(quizId), {
    method: "POST",
    body: input,
  });
}

export async function updateQuizQuestion(
  id: string,
  input: {
    prompt?: string;
    sort_order?: number;
    options?: { label: string; score_map: Record<string, number>; sort_order: number }[];
  }
): Promise<QuizQuestionAdminDto> {
  return apiClient<QuizQuestionAdminDto>(endpoints.quizzes.questionById(id), {
    method: "PUT",
    body: input,
  });
}

export async function deleteQuizQuestion(id: string): Promise<void> {
  await apiClient(endpoints.quizzes.questionById(id), { method: "DELETE" });
}

export async function playQuiz(id: string): Promise<QuizPlayDto> {
  return apiClient<QuizPlayDto>(endpoints.quizzes.play(id));
}

export async function submitQuizAttempt(
  id: string,
  answers: Record<string, string>
): Promise<QuizAttemptDto> {
  return apiClient<QuizAttemptDto>(endpoints.quizzes.attempts(id), {
    method: "POST",
    body: { answers },
  });
}
