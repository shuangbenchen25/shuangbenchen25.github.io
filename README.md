# shuangbenchen25.github.io

Personal academic homepage for Shuangben Chen.

## Architecture

This is a static multi-page GitHub Pages site:

- `index.html`: About / homepage.
- `academics/index.html`: education, coursework, awards, skills.
- `projects/index.html`: research, design, and media projects.
- `blog/index.html`: future notes and posts.
- `contact/index.html`: public academic contact.
- `others/index.html`: activities and interests.
- `assets/site.css`: shared layout, typography, light/dark themes, responsive styles.
- `assets/site.js`: shared language toggle, search, active navigation, and theme mode logic.
- `assets/brand/favicon.svg`: handwritten-style `2Ben` favicon and brand mark.
- `assets/cv/shuangben-chen-cv.pdf`: downloadable CV.

There is still no build step, package manager, framework, CDN, analytics, telemetry, or external network dependency.

## Interactive Features

- English / Chinese toggle.
- Site search across the main pages.
- Three-mode theme switch: System, Light, Dark.
- Theme and language choices are stored in browser `localStorage`.

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
- Blog: `blog/index.html`, plus `blog.*` translation keys.
- Contact: `contact/index.html`, plus `contact.*` translation keys.
- Others: `others/index.html`, plus `others.*` translation keys.
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
