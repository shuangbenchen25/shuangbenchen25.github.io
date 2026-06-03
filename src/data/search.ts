import { searchIndex as baseSearchIndex } from "./site";
import { excerptFromMarkdown, slugFromPath } from "../utils/content";

type SearchEntry = {
  url: string;
  title: { en: string; zh: string };
  text: string;
};

type ContentSearchOptions = {
  basePath: string;
  hrefForSlug: (slug: string) => string;
};

const blogRawModules = import.meta.glob("../content/blog/**/*.md", { eager: true, query: "?raw", import: "default" });
const newsRawModules = import.meta.glob("../content/news/**/*.md", { eager: true, query: "?raw", import: "default" });
const projectRawModules = import.meta.glob("../content/projects/**/*.md", { eager: true, query: "?raw", import: "default" });
const publicationRawModules = import.meta.glob("../content/publications/**/*.md", { eager: true, query: "?raw", import: "default" });

function readScalar(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "");
}

function readInlineArray(frontmatter: string, key: string) {
  const value = readScalar(frontmatter, key);
  if (!value?.startsWith("[") || !value.endsWith("]")) {
    return [];
  }
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function frontmatterFromRaw(raw: string) {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---/);
  return match?.[1] || "";
}

function entriesFromMarkdown(rawModules: Record<string, unknown>, options: ContentSearchOptions): SearchEntry[] {
  return Object.entries(rawModules)
    .map<SearchEntry | null>(([path, rawModule]) => {
      const raw = String(rawModule || "");
      const frontmatter = frontmatterFromRaw(raw);
      if (readScalar(frontmatter, "draft") === "true") {
        return null;
      }

      const title = readScalar(frontmatter, "title");
      if (!title) {
        return null;
      }

      const slug = readScalar(frontmatter, "slug") || slugFromPath(path, options.basePath);
      const description = readScalar(frontmatter, "description") || "";
      const tags = readInlineArray(frontmatter, "tags").join(" ");
      const excerpt = excerptFromMarkdown(raw, 220);

      return {
        url: options.hrefForSlug(slug),
        title: { en: title, zh: title },
        text: `${title} ${description} ${tags} ${excerpt}`
      };
    })
    .filter((entry): entry is SearchEntry => entry !== null);
}

const contentSearchIndex = [
  ...entriesFromMarkdown(blogRawModules, {
    basePath: "../content/blog/",
    hrefForSlug: (slug) => `/blog/posts/${slug}/`
  }),
  ...entriesFromMarkdown(newsRawModules, {
    basePath: "../content/news/",
    hrefForSlug: (slug) => `/news/#${slug}`
  }),
  ...entriesFromMarkdown(projectRawModules, {
    basePath: "../content/projects/",
    hrefForSlug: (slug) => `/projects/${slug}/`
  }),
  ...entriesFromMarkdown(publicationRawModules, {
    basePath: "../content/publications/",
    hrefForSlug: () => "/publications/"
  })
];

const staticSearchIndex = baseSearchIndex.filter(
  (item) => !item.url.startsWith("/blog/posts/") && !item.url.startsWith("/news/#")
);

export const searchIndex = [...staticSearchIndex, ...contentSearchIndex];
