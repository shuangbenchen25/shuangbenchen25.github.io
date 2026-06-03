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

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    venue: z.string().optional(),
    status: z.string().optional(),
    abstract: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.url()
    })).optional()
  })
});

const cv = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cv" }),
  schema: z.object({
    title: z.string(),
    titleZh: z.string().optional(),
    category: z.enum(["education", "experience", "award", "skill"]),
    organization: z.string().optional(),
    organizationZh: z.string().optional(),
    location: z.string().optional(),
    locationZh: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    order: z.number(),
    summary: z.string().optional(),
    summaryZh: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    highlightsZh: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    skillsZh: z.array(z.string()).optional()
  })
});

export const collections = { blog, news, projects, publications, cv };
