type MarkdownModule = {
  frontmatter?: {
    title?: string;
    date?: string | Date;
    description?: string;
  };
  Content?: (_props: Record<string, never>) => unknown;
};

export type ContentPreview = {
  title: string;
  date: Date;
  dateLabel: string;
  description?: string;
  excerpt: string;
  slug: string;
  href: string;
  Content: (_props: Record<string, never>) => unknown;
};

export function slugFromPath(path: string, basePath: string) {
  return path
    .replace(basePath, "")
    .replace(/\.md$/, "")
    .split("/")
    .map((part) =>
      part
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("--");
}

export function excerptFromMarkdown(raw: string, maxLength = 180) {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---/, "");
  const text = withoutFrontmatter
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^---+$/gm, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_~`>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}

export function collectContentPreviews(
  modules: Record<string, unknown>,
  rawModules: Record<string, unknown>,
  options: {
    basePath: string;
    hrefForSlug: (slug: string) => string;
    excerptLength?: number;
  }
) {
  return Object.entries(modules)
    .map<ContentPreview | null>(([path, mod]) => {
      const entry = mod as MarkdownModule;
      const title = entry.frontmatter?.title;
      const date = new Date(entry.frontmatter?.date || "");

      if (!title || Number.isNaN(date.getTime())) {
        return null;
      }

      const slug = slugFromPath(path, options.basePath);
      const raw = String(rawModules[path] || "");
      const excerpt = excerptFromMarkdown(raw, options.excerptLength);

      return {
        title,
        date,
        dateLabel: date.toISOString().slice(0, 10),
        ...(entry.frontmatter?.description ? { description: entry.frontmatter.description } : {}),
        excerpt,
        slug,
        href: options.hrefForSlug(slug),
        Content: entry.Content || (() => null)
      };
    })
    .filter((entry): entry is ContentPreview => entry !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
