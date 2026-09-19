/** กิจกรรมใน About Us — รูปหลายใบ + ลิงก์ Google Photos */
export type ActivityItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
  googlePhotosUrl: string;
};

export function activityPhotos(item: ActivityItem): string[] {
  const seen = new Set<string>();
  const photos: string[] = [];
  for (const url of [item.imageUrl, ...item.galleryUrls]) {
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    photos.push(trimmed);
  }
  return photos;
}
