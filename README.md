# shuangbenchen25.github.io

Personal academic homepage for Shuangben Chen.

## Architecture

This site is intentionally simple and GitHub Pages friendly:

- `index.html`: the entire homepage, including markup and CSS.
- `assets/cv/shuangben-chen-cv.pdf`: downloadable CV linked from the homepage.
- No build step, package manager, framework, CDN, analytics, or external network dependency.

The design combines the academic content structure of templates such as al-folio and Academic Pages with a lightweight static implementation that can be maintained directly in GitHub.

## How To Maintain Content

Edit `index.html` directly.

- Hero introduction: search for `hero-lede`.
- Research section: search for `id="research"`.
- Education section: search for `id="education"`.
- Experience section: search for `id="experience"`.
- Awards section: search for `id="awards"`.
- Skills section: search for `id="skills"`.
- Contact section: search for `id="contact"`.

To update the CV, replace:

```text
assets/cv/shuangben-chen-cv.pdf
```

with a newer PDF using the same filename, so the homepage links keep working.

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

For a user or organization GitHub Pages repository named `shuangbenchen25.github.io`, GitHub Pages serves `index.html` from the repository root after the changes are pushed to GitHub.
