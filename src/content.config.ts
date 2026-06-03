import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  })
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    track: z.enum(["research", "design", "media"]),
    type: z.string(),
    date: z.coerce.date(),
    status: z.string(),
    role: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    order: z.number(),
    links: z.array(z.object({
      label: z.string(),
      url: z.url()
    })).optional()
  })
});

export const collections = { blog, news, projects };
