import { listPublishedContents } from "@/features/content";
import { mapActivity } from "../mappers";
import type { ActivityItem } from "../types";

export async function fetchActivities(): Promise<ActivityItem[]> {
  const rows = await listPublishedContents("activity");
  return rows.map(mapActivity);
}
