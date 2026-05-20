# 网站内容维护指南

这个仓库现在已经迁移为 Astro 静态站点。以后优先维护 `src/` 和 `public/`，根目录下旧的 `index.html`、`academics/index.html` 等文件只是迁移前的静态快照。

## 最常改的文件

- 全站双语文本、导航、搜索索引：`src/data/site.ts`
- 全站布局：`src/layouts/BaseLayout.astro`
- 导航栏：`src/components/Header.astro`
- 页脚：`src/components/Footer.astro`
- 全站样式：`src/styles/site.css`
- 首页：`src/pages/index.astro`
- 学术页：`src/pages/academics/index.astro`
- 项目总览：`src/pages/projects/index.astro`
- 研究项目：`src/pages/projects/research/index.astro`
- 设计作品集：`src/pages/projects/design/index.astro`
- 博客列表：`src/pages/blog/index.astro`
- 博客文章页模板：`src/pages/blog/posts/[slug].astro`
- 博客 Markdown：`src/content/blog/*.md`
- 联系页：`src/pages/contact/index.astro`
- 其他页：`src/pages/others/index.astro`
- 名词解释页：`src/pages/terms/*/index.astro`
- CV：`public/assets/cv/shuangben-chen-cv.pdf`

## 修改中英文

所有可切换语言的文本集中在：

```text
src/data/site.ts
```

结构大致是：

```ts
export const translations = {
  en: {
    "hero.lede": "English text"
  },
  zh: {
    "hero.lede": "中文文本"
  }
}
```

页面中通过 `data-i18n="hero.lede"` 绑定这个 key。修改时请同时改 `en` 和 `zh`，这样中英文切换才不会出现一边新、一边旧的问题。

## 修改搜索

站内搜索数据在 `src/data/site.ts` 的 `searchIndex` 中。新增页面后，补一项：

```ts
{
  url: "/new-page/",
  title: { en: "New Page", zh: "新页面" },
  text: "keywords 中文关键词"
}
```

`text` 主要用于匹配关键词，不会完整显示在页面上。

## 添加博客

现在 Blog 已经由 Astro 自动读取 Markdown。新增文章放在 `src/content/blog/` 下即可；也可以按主题建子文件夹管理，例如：

```text
src/content/blog/course-notes/
src/content/blog/research/
src/content/blog/film/
```

新增文章步骤：

1. 在 `src/content/blog/` 或它的任意子文件夹中新建 Markdown 文件，例如：

```text
src/content/blog/research/2026-05-20-my-note.md
```

2. 写 front matter：

```yaml
---
title: "My Note"
date: 2026-05-20
description: "One sentence summary."
---
```

3. 在下面直接写正文 Markdown。

正文支持常规 Markdown 和 LaTeX 公式：

```md
Inline formula: $H(p,q)$

Block formula:

$$
H(p,q)=\sum_{j=1}^n -p_j\log(q_j)
$$
```

构建时，Astro 会自动生成：

```text
/blog/posts/research--2026-05-20-my-note/
```

并自动把它列进 `/blog/`。

文件名建议使用英文、数字和短横线。中文标题可以写在 front matter 的 `title` 里；文件名里不要使用空格、`&`、`#` 这类符号。

## 添加名词解释页

如果要给某个常见术语做解释页：

1. 新建目录：

```text
src/pages/terms/my-term/index.astro
```

2. 可以参考 `src/pages/terms/super-brain/index.astro`。
3. 在正文里链接它：

```html
<a class="term-link" href="/terms/my-term/">My Term</a>
```

4. 在 `src/data/site.ts` 的 `searchIndex` 中补搜索项。

## 更新 CV

替换这个文件：

```text
public/assets/cv/shuangben-chen-cv.pdf
```

保持文件名不变，页面链接就不用改。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建检查：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 发布

正常提交并推送即可：

```bash
git status --short
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Actions 会自动运行 Astro 构建并部署 `dist/` 到 GitHub Pages。首次切换到 Actions 部署时，如果线上仍显示旧页面，需要在 GitHub 仓库的 Pages 设置里确认 Source 使用 GitHub Actions。
