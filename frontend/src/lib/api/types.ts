export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined | null>;
};
