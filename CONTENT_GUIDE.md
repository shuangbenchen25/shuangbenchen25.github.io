# 网站内容维护指南

这是一份给 `shuangbenchen25.github.io` 的内容修改说明。当前网站是静态多页结构，没有前端构建步骤，也没有外部依赖。

## 常用文件

- 首页内容：`index.html`
- 学术页面：`academics/index.html`
- 项目总览：`projects/index.html`
- 研究项目：`projects/research/index.html`
- 设计作品集：`projects/design/index.html`
- 博客列表：`blog/index.html`
- 博客文章源码：`blog/posts/*.md`
- 博客文章页面：`blog/posts/YYYY-MM-DD-slug/index.html`
- 联系方式：`contact/index.html`
- 其他经历：`others/index.html`
- 名词解释页：`terms/*/index.html`
- 全站样式：`assets/site.css`
- 双语文本、搜索、主题切换、页脚更新时间：`assets/site.js`
- CV 文件：`assets/cv/shuangben-chen-cv.pdf`

## 修改双语文字

多数页面文字由 `assets/site.js` 里的 `translations` 控制。修改时同时改英文 `en` 和中文 `zh`，例如：

```js
"projects.research.title": "RL Post-training Infrastructure for Robotic Manipulation"
```

HTML 中通过 `data-i18n="projects.research.title"` 调用这些文本。只改 HTML 而不改 `assets/site.js`，切换语言后可能会被旧文案覆盖。

## 修改搜索结果

站内搜索结果由 `assets/site.js` 里的 `searchIndex` 控制。新增页面后，建议补一项：

```js
{
    url: "/new-page/",
    title: { en: "New Page", zh: "新页面" },
    text: "keywords for search 中文关键词"
}
```

`text` 不会直接显示完整内容，主要用于匹配关键词。

## 添加博客文章

1. 在 `blog/posts/` 下新建 Markdown 源文件，例如 `2026-05-20-my-note.md`。
2. 文件开头写 front matter：

```yaml
---
layout: post
title: "My Note"
date: 2026-05-20
description: "One sentence summary."
---
```

3. 为本地静态预览新增对应 HTML 页面：`blog/posts/2026-05-20-my-note/index.html`。
4. 在 `blog/index.html` 的 `.post-list` 中添加文章链接。
5. 在 `assets/site.js` 的 `searchIndex` 中添加博客文章搜索项。

如果以后想实现“只拖入 Markdown 并 push 后自动生成列表”，需要增加一个 GitHub Pages build workflow 来扫描 `blog/posts/*.md` 并生成 HTML 与博客列表。

## 添加名词解释页

如果正文中反复出现某个专有名词，可以在 `terms/` 下新增页面，例如：

```text
terms/my-term/index.html
```

然后在正文中把对应词改成链接：

```html
<a class="term-link" href="/terms/my-term/">My Term</a>
```

新增后也建议更新 `assets/site.js` 的 `searchIndex`。

## 更新 CV

直接替换这个文件即可：

```text
assets/cv/shuangben-chen-cv.pdf
```

保持文件名不变，网站里的 CV 链接就不需要改。

## 本地预览

在仓库根目录运行：

```bash
python3 -m http.server 8000
```

然后打开：

```text
http://127.0.0.1:8000/
```

修改 HTML、CSS、JS 后刷新浏览器即可。Safari 有时会缓存旧页面，看到异常时先强制刷新。

## 发布

确认本地预览正常后：

```bash
git status --short
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Pages 刷新线上页面通常需要几十秒到几分钟。
