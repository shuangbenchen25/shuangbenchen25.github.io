import type { CollectionEntry } from "astro:content";

export type PublicationEntry = CollectionEntry<"publications">;

export function sortPublications(entries: PublicationEntry[]) {
  return [...entries].sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

export function visiblePublications(entries: PublicationEntry[]) {
  return sortPublications(entries.filter((entry) => !entry.data.draft));
}
