import type { CollectionEntry } from "astro:content";

export type CvEntry = CollectionEntry<"cv">;
export type CvCategory = CvEntry["data"]["category"];

const categoryOrder: CvCategory[] = ["education", "experience", "award", "skill"];

export function sortCvEntries(entries: CvEntry[]) {
  return [...entries].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export function groupCvEntries(entries: CvEntry[]) {
  const groups = new Map<CvCategory, CvEntry[]>();

  for (const category of categoryOrder) {
    groups.set(category, []);
  }

  for (const entry of sortCvEntries(entries)) {
    groups.get(entry.data.category)?.push(entry);
  }

  return categoryOrder.map((category) => ({
    category,
    entries: groups.get(category) || []
  }));
}

export function cvDateRange(entry: CvEntry) {
  const { start, end } = entry.data;
  if (start && end) {
    return `${start} - ${end}`;
  }
  return start || end || "";
}
