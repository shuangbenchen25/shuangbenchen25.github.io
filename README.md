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
- `src/data/site.ts`: bilingual text, navigation data, search index, and shared tag lists.
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
- Update search results in the `searchIndex` array in `src/data/site.ts`.
- Replace the CV at `public/assets/cv/shuangben-chen-cv.pdf`.

See `CONTENT_GUIDE.md` for the Chinese maintenance guide.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs dependencies, runs `npm run build`, uploads `dist/`, and deploys it to GitHub Pages.
