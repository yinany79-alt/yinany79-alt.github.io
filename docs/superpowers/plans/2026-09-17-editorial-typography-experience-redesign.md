# Editorial Typography and Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将个人技术网站改造成 Claude/Anthropic 气质的中文编辑型技术出版物，并以结构化数据和真实品牌 Logo 统一呈现京东工作经历与北京大学教育经历。

**Architecture:** 在 `content/site.ts` 中维护经历事实，在独立 `ExperienceList` 组件中统一渲染，首页、关于页和简历页只消费同一数据源。全站通过 CSS 字体角色与密度变体统一项目和文章版式；不引入远程字体、第三方字体包或新的 UI 依赖。

**Tech Stack:** Vinext/Next-compatible App Router、React 19、TypeScript、MDX、CSS、静态导出、GitHub Pages、OpenAI Sites。

**Spec:** `docs/superpowers/specs/2026-09-17-editorial-typography-experience-design.md`

## Global Constraints

- 默认语言与导航保持中文；必要技术专名可保留英文。
- 不下载、不分发 Anthropic 专有字体，只使用系统字体栈复现编辑气质。
- 工作经历固定为：京东零售｜AI Infra 与大数据计算部｜AI 产品经理｜2025–至今。
- 教育经历固定为：北京大学｜信息管理系｜信息管理与信息系统｜本科｜2021–2025。
- Logo 复用现有简历本地资产，不从远程地址加载，不改变品牌颜色，不裁剪。
- 浅色默认与星球模式必须同时适配；`prefers-reduced-motion` 降级保持有效。
- 不修改现有项目/文章正文、简历 PDF、技术拓扑数据或未确认联系方式。
- 保持原生 `<a>`，不引入 `next/link` 静态预取回归。

---

### Task 1: 结构化经历数据与品牌资产

**Files:**
- Modify: `lib/content-types.ts`
- Modify: `content/site.ts`
- Create: `components/experience-list.tsx`
- Create: `public/brands/jd.png`（复制自 `/Users/yangyinan.8/Desktop/简历/杨弋南_ASu双页简历/logos/jd.png`）
- Create: `public/brands/pku.png`（复制自 `/Users/yangyinan.8/Desktop/简历/杨弋南_ASu双页简历/logos/pku.png`）
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Produces: `ExperienceRecord`、`experiences: ExperienceRecord[]`、`ExperienceList({ items, compact? })`。
- Consumes: 现有 `siteProfile` 和站点 CSS 变量。

- [ ] **Step 1: 扩展类型并让内容校验先失败**

在 `lib/content-types.ts` 新增：

```ts
export type ExperienceRecord = {
  id: "jd" | "pku";
  kind: "work" | "education";
  organization: string;
  unit: string;
  title: string;
  detail?: string;
  period: string;
  logoSrc: string;
  logoAlt: string;
};
```

在 `scripts/validate-content.mjs` 的简历 PDF 校验之后增加品牌资产存在性检查：

```js
for (const brand of ["public/brands/jd.png", "public/brands/pku.png"]) {
  if (!fs.existsSync(path.join(process.cwd(), brand))) {
    throw new Error(`品牌资产缺失：${brand}`);
  }
}
```

- [ ] **Step 2: 运行校验并确认失败**

Run: `npm run check:content`

Expected: FAIL，错误包含 `品牌资产缺失`。

- [ ] **Step 3: 复制并检查真实 Logo**

将双页简历的 `jd.png`、`pku.png` 原样复制到 `public/brands/`。使用 `file` 验证两张图片仍为可识别 PNG，并记录尺寸；不得重新编码、拉伸或修改颜色。

- [ ] **Step 4: 写入唯一经历数据源**

在 `content/site.ts` 导出：

```ts
export const experiences: ExperienceRecord[] = [
  {
    id: "jd",
    kind: "work",
    organization: "京东零售",
    unit: "AI Infra 与大数据计算部",
    title: "AI 产品经理",
    period: "2025–至今",
    logoSrc: "/brands/jd.png",
    logoAlt: "京东 Logo",
  },
  {
    id: "pku",
    kind: "education",
    organization: "北京大学",
    unit: "信息管理系",
    title: "信息管理与信息系统",
    detail: "本科",
    period: "2021–2025",
    logoSrc: "/brands/pku.png",
    logoAlt: "北京大学 Logo",
  },
];
```

- [ ] **Step 5: 实现复用组件**

`components/experience-list.tsx` 使用语义化列表，每条包含 Logo、类型、组织、部门/院系、角色/专业、学历和时间；`compact` 只调整 CSS 数据属性，不删减事实：

```tsx
export function ExperienceList({ items, compact = false }: { items: ExperienceRecord[]; compact?: boolean }) {
  return <section className="experience-list" data-compact={compact} aria-label="工作与教育经历">
    {items.map((item) => <article className="experience-item" key={item.id}>
      <div className="experience-logo"><img src={item.logoSrc} alt={item.logoAlt} /></div>
      <div className="experience-copy">
        <span>{item.kind === "work" ? "工作经历" : "教育经历"}</span>
        <h3>{item.organization}</h3>
        <p>{item.unit}</p>
        <strong>{item.title}{item.detail ? ` · ${item.detail}` : ""}</strong>
      </div>
      <time>{item.period}</time>
    </article>)}
  </section>;
}
```

- [ ] **Step 6: 验证并提交**

Run: `npm run check:content && npm run lint && npx tsc --noEmit`

Expected: 全部通过。

Commit: `feat: add structured work and education experience`

---

### Task 2: 编辑型字体系统与项目页面降密度

**Files:**
- Modify: `app/globals.css`
- Modify: `components/content-shell.tsx`
- Modify: `components/project-list.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: Task 1 保持不变的内容类型；现有 `ContentShell` 的 `density` 属性。
- Produces: 全站 `--font-editorial`、`--font-sans`、`--font-mono`，以及项目目录/详情的稳定标题层级。

- [ ] **Step 1: 建立字体角色和暖色令牌**

在 `:root` 和主题区定义：

```css
--font-editorial: "Iowan Old Style", "Charter", "Baskerville", "Songti SC", "STSong", "Noto Serif CJK SC", serif;
--font-sans: "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", Arial, sans-serif;
--font-mono: "SFMono-Regular", "Cascadia Mono", Menlo, monospace;
--site-bg: #f5f2eb;
--site-surface: #fbfaf7;
--site-accent-warm: #b44f2a;
```

星球模式提供 `--site-accent-warm` 的高对比对应值，但不改变默认浅色主题策略。

- [ ] **Step 2: 缩小内容页主标题**

统一调整：

```css
.content-hero h1 {
  font-family: var(--font-editorial);
  font-size: clamp(40px, 4.2vw, 52px);
  line-height: 1.08;
  letter-spacing: -.04em;
}
.content-page[data-density="article"] .content-hero h1 {
  max-width: 900px;
  font-size: clamp(38px, 4.4vw, 54px);
}
```

移动端主标题设置为 `clamp(30px, 10vw, 38px)`；正文和页面简介继续使用无衬线字体。

- [ ] **Step 3: 收敛项目目录行**

将 `.record-row` 的最小高度降至约 132px，项目标题改用 `var(--font-editorial)` 和 `clamp(22px, 2.4vw, 30px)`；职责、关键结果和标签保持 13–14px，并限制摘要最大宽度。首页 `data-variant="home"` 继续显示职责与首个结果。

- [ ] **Step 4: 收敛项目详情**

保持 `project-meta`、`tag-line` 和 `outcome-strip` 的数据结构，降低卡片高度与字号；`.prose-tech h2` 改为 `clamp(28px, 3vw, 34px)`，`.prose-tech h3` 改为 22px，正文宽度保持 720px 左右。

- [ ] **Step 5: 验证并提交**

Run: `npm run lint && npx tsc --noEmit && npm run build && npm run check:build`

Expected: 12 个静态路由和关键产物全部通过。

Commit: `style: introduce editorial typography for project pages`

---

### Task 3: 博客目录与文章阅读版式

**Files:**
- Modify: `components/post-list.tsx`
- Modify: `components/post-filter.tsx`
- Modify: `app/writing/page.tsx`
- Modify: `app/writing/[slug]/page.tsx`
- Modify: `components/markdown-content.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `PostSummary[]`、`PostRecord`、现有标签筛选与逐页 metadata。
- Produces: 编辑型文章目录与窄阅读列；不改变 MDX frontmatter 结构。

- [ ] **Step 1: 固定文章列表语义结构**

保留 `article > time + .post-main + .post-reading`，标题必须维持 `h2 > a`；标签继续使用相邻 `span`，不得重新把摘要和标签包入标题链接。

- [ ] **Step 2: 调整文章目录样式**

设置：日期列约 104px、阅读时间约 80px；文章标题使用 `var(--font-editorial)`、桌面 `clamp(22px, 2.5vw, 30px)`、移动端 22px；摘要 14–15px，标签和日期使用等宽字体。筛选按钮弱化为轻量索引，选中状态同时具备背景、边框和 `aria-pressed`。

- [ ] **Step 3: 调整文章详情阅读列**

`.prose-tech` 改为 `width: min(720px, 100%)`、正文 17px、行高 1.95；段落间距 24px。标题层级：`h2` 28–34px、`h3` 21–24px，均使用编辑型字体。为 `blockquote`、`pre`、`code`、`ul/ol`、图片和水平分隔线补齐统一样式，并为 `pre` 设置 `overflow-x: auto`，不能推动页面横向溢出。

- [ ] **Step 4: 检查元信息与分享 metadata**

确认文章详情仍调用 `generateMetadata` 输出 `${post.title} · 杨弋南` 与 `post.summary`；日期、阅读时间、标签在 320px 下允许换行，不裁切。

- [ ] **Step 5: 验证并提交**

Run: `npm run check:content && npm run lint && npx tsc --noEmit && npm run build`

Expected: 标签筛选、三篇文章详情和独立 metadata 构建通过。

Commit: `style: refine editorial blog reading experience`

---

### Task 4: 页面接入、视觉 QA 与双端发布

**Files:**
- Modify: `components/home-continuation.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/resume/page.tsx`
- Modify: `app/globals.css`
- Modify: `design-qa.md`
- Modify: `scripts/validate-build.mjs`（仅在新资产未覆盖时增加验证）

**Interfaces:**
- Consumes: Task 1 的 `experiences` 与 `ExperienceList`；Task 2/3 的字体与版式。
- Produces: 首页、关于页、简历页一致的经历呈现，以及可部署的最终版本。

- [ ] **Step 1: 接入首页经历区**

用 `<ExperienceList items={experiences} compact />` 替换现有只含北大信息的页尾三格；在经历列表之后保留“查看与下载简历”和 GitHub 两个行动入口。首页区块标题使用 `h2`“经历”，避免 Logo 成为唯一信息通道。

- [ ] **Step 2: 接入关于页和简历页**

关于页保留“我在做什么 / 我如何思考”，第三张教育卡片移除，新增独立经历区。简历页在三项能力方向之后渲染完整经历列表，再展示简历下载入口；页面不得重复硬编码组织名称。

- [ ] **Step 3: 添加经历视觉规则**

`.experience-list` 使用边界清晰的两行列表；Logo 框约 56×56px，图片 `max-width/max-height: 100%`、`object-fit: contain`。组织名使用编辑型字体 22–26px，部门、角色、时间使用无衬线/等宽字体。移动端切为 Logo + 内容两列，时间进入内容下方。

- [ ] **Step 4: 完整自动化验证**

Run: `git diff --check`

Run: `npm run check:content`

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run build`

Run: `npm run check:build`

Expected: 全部成功；12 个关键静态产物存在。

- [ ] **Step 5: 浏览器 QA**

在本地预览中逐项检查：首页、项目目录、至少一个项目详情、文章目录、至少一篇文章详情、简历页和关于页。分别验证 1280px、375px、浅色、星球模式、键盘焦点和 `document.documentElement.scrollWidth === document.documentElement.clientWidth`。检查两张 Logo 清晰、不变形；标题不再压过正文；标签筛选、主题切换、拓扑节点和简历下载可用。

将结果写入 `design-qa.md`，包含日期、检查页面、视口、主题、结论和已修问题，不记录内部凭证或临时部署信息。

- [ ] **Step 6: 提交并发布**

Commit: `feat: publish editorial experience redesign`

推送 `main` 到 GitHub Pages 源仓库，等待并读取公开首页与文章页，确认新标题和中文经历内容存在。按照 `sites-hosting` 技能将同一 commit 和构建产物保存为新版本，并保持现有 owner-only 访问策略部署到 Sites 备份。

- [ ] **Step 7: 记忆收尾**

更新 `/Users/yangyinan.8/Desktop/Obsidian/Agent-Memory/projects/求职个人网站.md` 的 `updated` 日期、已确认方向、发布状态和变更记录；若仍缺公开邮箱/个人域名，在 `agent/open-loops.md` 保留一条明确待办。不得记录凭证。
