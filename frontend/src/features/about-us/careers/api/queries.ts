import { listPublishedContents } from "@/features/content";
import { mapCareerPath } from "../mappers";
import type { CareerPath } from "../types";

export async function fetchCareers(): Promise<CareerPath[]> {
  const rows = await listPublishedContents("career_path");
  return rows.map(mapCareerPath);
}
