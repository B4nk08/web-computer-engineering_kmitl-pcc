export type Classmate = {
  id: string;
  studentCode: string | null;
  fullName: string;
  cohort: string | null;
  isSelf: boolean;
};

export type ClassmateDto = {
  id: string;
  student_code?: string;
  full_name: string;
  cohort?: string;
  is_self?: boolean;
};

export type ClassmatesError = "forbidden" | "missing_code" | "load";
