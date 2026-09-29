/** View-model สำหรับหน้าคุณสมบัติผู้สมัคร (/about-us/admission-requirements) */

export type SupportItem = {
  title: string;
  detail: string;
};

/** บล็อกเนื้อหาในกล่องคุณสมบัติ / เอกสาร */
export type AdmissionBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] };

/** โครงสร้างที่ Admin กรอก — แยกช่องชัด ไม่ต้องใส่เครื่องหมาย - */
export type AdmissionSectionContent = {
  intro: string;
  heading: string;
  items: string[];
};

export type AdmissionsInfo = {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  tuition: string;
  quota: string;
  applyUrl: string;
  qualificationsSection: AdmissionSectionContent;
  documentsSection: AdmissionSectionContent;
  qualifications: AdmissionBlock[];
  supportItems: SupportItem[];
  documents: AdmissionBlock[];
};

export function emptyAdmissionSection(): AdmissionSectionContent {
  return { intro: "", heading: "", items: [] };
}

export function blocksFromSection(
  section: AdmissionSectionContent,
): AdmissionBlock[] {
  const blocks: AdmissionBlock[] = [];
  const intro = section.intro.trim();
  const heading = section.heading.trim();
  const items = section.items.map((item) => item.trim()).filter(Boolean);
  if (intro) blocks.push({ type: "paragraph", text: intro });
  if (heading) blocks.push({ type: "heading", text: heading });
  if (items.length > 0) blocks.push({ type: "bullets", items });
  return blocks;
}

export function sectionHasContent(section: AdmissionSectionContent): boolean {
  return blocksFromSection(section).length > 0;
}

/**
 * แปลงข้อความเก่า (เกริ่นนำ + หัวข้อ + บรรทัดขึ้นต้นด้วย -) เป็นช่องแยก
 */
export function parseAdmissionBlocks(raw: string): AdmissionBlock[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const hasBullet = lines.some((line) => /^[-•*]\s+\S/.test(line.trim()));

  if (!hasBullet) {
    const items = lines.map((line) => line.trim()).filter(Boolean);
    return items.length > 0 ? [{ type: "bullets", items }] : [];
  }

  const blocks: AdmissionBlock[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push({ type: "bullets", items: bullets });
    bullets = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      flushBullets();
      continue;
    }

    const bullet = trimmed.match(/^[-•*]\s+(.*)$/);
    if (bullet) {
      const text = bullet[1].trim();
      if (text) bullets.push(text);
      continue;
    }

    flushBullets();
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j += 1;
    const nextIsBullet =
      j < lines.length && /^[-•*]\s+\S/.test(lines[j].trim());
    blocks.push({
      type: nextIsBullet ? "heading" : "paragraph",
      text: trimmed,
    });
  }

  flushBullets();
  return blocks;
}

export function sectionFromBlocks(
  blocks: AdmissionBlock[],
): AdmissionSectionContent {
  const paragraphs: string[] = [];
  const headings: string[] = [];
  const items: string[] = [];

  for (const block of blocks) {
    if (block.type === "paragraph") paragraphs.push(block.text);
    else if (block.type === "heading") headings.push(block.text);
    else items.push(...block.items);
  }

  return {
    intro: paragraphs.join("\n\n"),
    heading: headings[0] ?? "",
    items:
      headings.length > 1
        ? [...headings.slice(1).map((h) => h), ...items]
        : items,
  };
}

/** อ่านค่าจาก DB — รองรับ object ใหม่ / string เก่า / string[] เก่า */
export function sectionFromExtraValue(value: unknown): AdmissionSectionContent {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const row = value as Record<string, unknown>;
    const intro = typeof row.intro === "string" ? row.intro : "";
    const heading = typeof row.heading === "string" ? row.heading : "";
    const items = Array.isArray(row.items)
      ? row.items
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      : [];
    return { intro, heading, items };
  }

  if (typeof value === "string") {
    return sectionFromBlocks(parseAdmissionBlocks(value));
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return { intro: "", heading: "", items };
  }

  return emptyAdmissionSection();
}

export function sectionToExtraValue(
  section: AdmissionSectionContent,
): Record<string, unknown> | undefined {
  const intro = section.intro.trim();
  const heading = section.heading.trim();
  const items = section.items.map((item) => item.trim()).filter(Boolean);
  if (!intro && !heading && items.length === 0) return undefined;
  return { intro, heading, items };
}
