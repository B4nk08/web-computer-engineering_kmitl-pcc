export const endpoints = {
  health: "/health",
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    token: "/api/auth/token",
    getToken: "/api/auth/get-token",
    google: "/api/auth/google",
    me: "/api/auth/me",
  },
  students: {
    list: "/api/students",
  },
  whitelist: {
    create: "/api/whitelist",
    importPreview: "/api/whitelist/import/preview",
    importCommit: "/api/whitelist/import/commit",
  },
  contents: {
    list: "/api/contents",
    byId: (id: string) => `/api/contents/${id}`,
  },
  quizzes: {
    list: "/api/quizzes",
    byId: (id: string) => `/api/quizzes/${id}`,
    play: (id: string) => `/api/quizzes/${id}/play`,
    questions: (id: string) => `/api/quizzes/${id}/questions`,
    attempts: (id: string) => `/api/quizzes/${id}/attempts`,
    questionById: (id: string) => `/api/quiz-questions/${id}`,
  },
  exams: {
    start: "/api/exams/start",
    submit: (id: string) => `/api/exams/attempts/${id}/submit`,
    subjects: "/api/exams/subjects",
    subjectById: (id: string) => `/api/exams/subjects/${id}`,
    questions: "/api/exams/questions",
    questionById: (id: string) => `/api/exams/questions/${id}`,
    settings: "/api/exams/settings",
    settingBySubjectMode: (subject: string, mode: string) =>
      `/api/exams/settings/${subject}/${mode}`,
    credentials: "/api/exams/credentials",
    attempts: "/api/exams/attempts",
  },
  uploads: {
    presign: "/api/uploads/presign",
  },
} as const;
