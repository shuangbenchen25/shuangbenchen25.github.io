import type { CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectTrack = ProjectEntry["data"]["track"];

export function projectHref(project: ProjectEntry) {
  return `/projects/${project.data.slug}/`;
}

export function sortProjects(projects: ProjectEntry[]) {
  return [...projects].sort((a, b) => a.data.order - b.data.order);
}

export function projectsByTrack(projects: ProjectEntry[], tracks: ProjectTrack[]) {
  const trackSet = new Set(tracks);
  return sortProjects(projects).filter((project) => trackSet.has(project.data.track));
}

