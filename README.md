# shuangbenchen25.github.io

Personal academic homepage for Shuangben Chen, now maintained as an Astro static site.

## Architecture

Astro source lives in `src/` and builds to `dist/`:

- `src/layouts/BaseLayout.astro`: shared HTML shell.
- `src/components/Header.astro`: shared navigation, search input, language button, theme button.
- `src/components/Footer.astro`: shared copyright and last-updated footer.
- `src/components/PageHead.astro`: reusable page heading.
- `src/pages/`: route files for About, Academics, Projects, Blog, Contact, Others, and Terms.
- `src/content/blog/`: Markdown blog posts discovered automatically at build time.
- `src/content/news/`: Markdown news items discovered automatically at build time.
- `src/content/projects/`: Markdown project entries used by project lists and detail pages.
- `src/content/publications/`: Markdown publication records; drafts are hidden.
- `src/content/cv/`: structured CV entries shared by Academics and CV pages.
- `src/data/site.ts`: bilingual text, navigation data, search index, and shared tag lists.
- `src/data/search.ts`: generated static search index that combines core pages and Markdown content.
- `src/scripts/site.ts`: client-side language toggle, search, active nav, theme mode, and footer update logic.
- `src/styles/site.css`: shared visual system.
- `public/assets/`: static favicon and CV copied into the built site.
- `.github/workflows/deploy.yml`: GitHub Pages deployment workflow.

The old root-level HTML files are kept as a fallback snapshot, but the maintained source of truth is now `src/`.

## Commands

Install dependencies:

```bash
npm install
```

Run local Astro dev server:

```bash
npm run dev
```

Build and type-check:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

Astro telemetry is disabled in all npm scripts with `ASTRO_TELEMETRY_DISABLED=1`.

## Content Workflow

- Edit bilingual interface text in `src/data/site.ts`.
- Edit shared layout in `src/components/` and `src/layouts/`.
- Edit page structure in `src/pages/`.
- Add blog posts as Markdown files in `src/content/blog/`.
- Add project entries as Markdown files in `src/content/projects/`.
- Add publication entries as Markdown files in `src/content/publications/` and set `draft: false` when public.
- Add education, experience, awards, and skills in `src/content/cv/`.
- Search automatically includes Blog, News, Projects, and Publications Markdown content; edit core page search keywords in `src/data/site.ts`.
- RSS is generated at `/rss.xml`; sitemap is generated at `/sitemap.xml`.
- Replace the CV at `public/assets/cv/shuangben-chen-cv.pdf`.

See `CONTENT_GUIDE.md` for the Chinese maintenance guide.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs dependencies, runs `npm run build`, uploads `dist/`, and deploys it to GitHub Pages.
