# shuangbenchen25.github.io

Personal academic homepage for Shuangben Chen.

## Architecture

This is a static multi-page GitHub Pages site:

- `index.html`: About / homepage.
- `academics/index.html`: education, coursework, awards, skills.
- `projects/index.html`: research, design, and media projects.
- `projects/research/index.html`: research project detail page.
- `projects/design/index.html`: design portfolio page.
- `blog/index.html`: future notes and posts.
- `blog/posts/*.md`: Markdown blog post sources with YAML front matter.
- `blog/posts/YYYY-MM-DD-slug/index.html`: static rendered post pages for reliable local preview.
- `contact/index.html`: public academic contact.
- `others/index.html`: activities and interests.
- `terms/super-brain/index.html`: named-term detail page linked from the site.
- `assets/site.css`: shared layout, typography, light/dark themes, responsive styles.
- `assets/site.js`: shared language toggle, search, active navigation, and theme mode logic.
- `assets/brand/favicon.svg`: handwritten-style `2Ben` favicon and brand mark.
- `assets/cv/shuangben-chen-cv.pdf`: downloadable CV.
- `CONTENT_GUIDE.md`: Chinese guide for updating page content.

There is still no build step, package manager, framework, CDN, analytics, telemetry, or external network dependency.

## Interactive Features

- English / Chinese toggle.
- Site search across the main pages.
- Three-mode theme switch: System, Light, Dark.
- Theme and language choices are stored in browser `localStorage`.
- Mobile navigation collapses behind a menu button.

## Blog Workflow

Markdown blog posts live in:

```text
blog/posts/
```

Create a new `.md` file with front matter:

```yaml
---
layout: post
title: "Your Title"
date: 2026-05-20
description: "One sentence summary."
---
```

The visible blog index is currently static so it works under the lightweight local preview command. For each published post, keep the Markdown source in `blog/posts/` and add a matching rendered HTML page at `blog/posts/YYYY-MM-DD-slug/index.html`.

To make this fully automatic after every push, the clean next step is adding a small GitHub Pages build workflow that scans `blog/posts/*.md`, renders HTML pages, and regenerates `blog/index.html` by date.

## Typography

The site uses local system font stacks rather than bundled font files:

- Display: `New York`, `Iowan Old Style`, `Athelas`, `Charter`, `Georgia`.
- Body/UI: `Avenir Next`, `Optima`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`.

This avoids the previous Songti-like body appearance without copying unknown-license font files from the local machine.

## How To Maintain Content

Edit the relevant page for structure and edit `assets/site.js` for bilingual text.

- Homepage intro: `index.html`, plus `hero.*` translation keys in `assets/site.js`.
- Academics: `academics/index.html`, plus `academics.*` translation keys.
- Projects: `projects/index.html`, plus `projects.*` translation keys.
- Project subpages: `projects/research/index.html` and `projects/design/index.html`.
- Blog: `blog/index.html`, plus `blog.*` translation keys.
- Blog posts: add Markdown files under `blog/posts/`.
- Contact: `contact/index.html`, plus `contact.*` translation keys.
- Others: `others/index.html`, plus `others.*` translation keys.
- Named terms: add pages under `terms/` and link repeated terms with `term-link`.
- Search results: update the `searchIndex` array in `assets/site.js`.

When changing visible text controlled by JavaScript, update both English and Chinese entries in `assets/site.js`.

To update the CV, replace:

```text
assets/cv/shuangben-chen-cv.pdf
```

with a newer PDF using the same filename, so links keep working.

## Local Preview

From this repository:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

For a user or organization GitHub Pages repository named `shuangbenchen25.github.io`, GitHub Pages serves these files after the changes are pushed to GitHub.
