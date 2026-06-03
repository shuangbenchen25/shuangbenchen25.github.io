import { collectContentPreviews } from "../utils/content";

const siteUrl = "https://shuangbenchen25.github.io";

const blogModules = import.meta.glob("../content/blog/**/*.md", { eager: true });
const blogRawModules = import.meta.glob("../content/blog/**/*.md", { eager: true, query: "?raw", import: "default" });
const newsModules = import.meta.glob("../content/news/**/*.md", { eager: true });
const newsRawModules = import.meta.glob("../content/news/**/*.md", { eager: true, query: "?raw", import: "default" });

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const blogPosts = collectContentPreviews(blogModules, blogRawModules, {
    basePath: "../content/blog/",
    hrefForSlug: (slug) => `/blog/posts/${slug}/`,
    excerptLength: 260
  });
  const newsItems = collectContentPreviews(newsModules, newsRawModules, {
    basePath: "../content/news/",
    hrefForSlug: (slug) => `/news/#${slug}`,
    excerptLength: 220
  });

  const items = [...blogPosts, ...newsItems]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 30)
    .map((item) => {
      const url = new URL(item.href, siteUrl).toString();
      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <pubDate>${item.date.toUTCString()}</pubDate>
  <description>${escapeXml(item.description || item.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Shuangben Chen</title>
  <link>${siteUrl}</link>
  <description>Blog posts and recent updates by Shuangben Chen.</description>
  <language>en</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
