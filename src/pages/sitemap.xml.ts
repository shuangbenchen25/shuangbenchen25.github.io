import { collectContentPreviews } from "../utils/content";

const siteUrl = "https://shuangbenchen25.github.io";
const staticRoutes = ["/", "/academics/", "/publications/", "/cv/", "/projects/", "/projects/research/", "/projects/design/", "/blog/", "/news/", "/others/", "/terms/super-brain/"];

const blogModules = import.meta.glob("../content/blog/**/*.md", { eager: true });
const blogRawModules = import.meta.glob("../content/blog/**/*.md", { eager: true, query: "?raw", import: "default" });
const projectRawModules = import.meta.glob("../content/projects/**/*.md", { eager: true, query: "?raw", import: "default" });

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugFromProjectRaw(raw: string, path: string) {
  const slugMatch = raw.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
  if (slugMatch?.[1]) {
    return slugMatch[1].trim();
  }
  return path.replace("../content/projects/", "").replace(/\.md$/, "");
}

export function GET() {
  const blogRoutes = collectContentPreviews(blogModules, blogRawModules, {
    basePath: "../content/blog/",
    hrefForSlug: (slug) => `/blog/posts/${slug}/`
  }).map((post) => post.href);

  const projectRoutes = Object.entries(projectRawModules)
    .map(([path, raw]) => `/projects/${slugFromProjectRaw(String(raw || ""), path)}/`);

  const urls = [...staticRoutes, ...blogRoutes, ...projectRoutes]
    .map((route) => `<url><loc>${escapeXml(new URL(route, siteUrl).toString())}</loc></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
