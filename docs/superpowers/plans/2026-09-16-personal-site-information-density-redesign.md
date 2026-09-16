# Personal Site Information Density Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把杨弋南个人技术站改造成默认中文、信息密度更高的“技术工作台 + 个人日志流”，保留交互拓扑并重做文章列表、视觉层级和微动效。

**Architecture:** 继续使用 Vinext 静态导出、React 19、MDX 与现有结构化配置。个人资料、工作方向、项目和文章分别保持单一数据源；首页由服务器组件组合内容，只有拓扑、主题切换、标签筛选和进入视口动效使用客户端状态。

**Tech Stack:** Vinext / Next-compatible App Router、React 19、TypeScript、Tailwind CSS 4 + 站点 CSS、MDX 原文解析、Radix/Shadcn Switch、Lucide Icons、Canvas、GitHub Pages、OpenAI Sites。

**Spec:** `docs/superpowers/specs/2026-09-16-personal-site-information-density-redesign.md`

## Global Constraints

- 全站默认中文，不增加英文版本或语言切换按钮。
- 首次访问默认浅色；保留可持久化的星球模式。
- 姓名必须是“杨弋南”，使用中文衬线字体栈，桌面端 52–60px，移动端 38–44px。
- 求职状态固定表达为“关注相关机会”，不写“正在求职”或到岗时间。
- 保留 Harness、Training、Recommendation 三种拓扑模式和节点详情。
- 正文默认不小于 16px；常用标签和操作不小于 14px；次要元数据可使用 12–13px。
- 不增加 CMS、搜索、评论、订阅、登录、数据库或重量级 3D 框架。
- 不新增虚构文章、工作数据、项目指标、联系方式或模型效果数据。
- 所有非必要动效必须遵守 `prefers-reduced-motion`。
- 保持静态导出兼容性，站内链接继续使用语义化原生 `<a>`，避免 Vinext RSC prefetch 问题。

---

### Task 1: 扩展可维护的站点与文章内容模型

**Files:**
- Modify: `lib/content-types.ts`
- Modify: `content/site.ts`
- Modify: `content/posts/harness-is-a-system.mdx`
- Modify: `content/posts/llm-training-product-model.mdx`
- Modify: `content/posts/generative-recommendation-infra.mdx`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Produces: `SiteProfile.welcome: string`、`SiteProfile.opportunityStatus: string`、`SiteProfile.focusAreas: string[]`、`SiteProfile.github: string`。
- Produces: `Workstream` 类型与 `workstreams: Workstream[]` 配置；`Workstream` 包含 `id`、`title`、`summary`、`href`、`tone`。
- Produces: `PostRecord.tags: string[]`，供首页最近文章和文章页标签筛选复用。

- [ ] **Step 1: 先收紧内容校验，使缺少标签的文章构建失败**

在 `scripts/validate-content.mjs` 中把文章必填字段改为：

```js
posts: ["title", "slug", "summary", "publishedAt", "topic", "readingMinutes", "tags"],
```

并在 frontmatter 循环中加入日期与数组格式校验：

```js
if (collection === "posts") {
  const date = frontmatter[1].match(/^publishedAt:\s*(.+)$/m)?.[1]?.trim();
  const tags = frontmatter[1].match(/^tags:\s*\[(.*)\]$/m)?.[1]?.trim();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${collection}/${name}: publishedAt 必须是 YYYY-MM-DD`);
  if (!tags) throw new Error(`${collection}/${name}: tags 必须是非空数组`);
}
```

- [ ] **Step 2: 运行内容校验并确认现有文章因缺少 tags 失败**

Run: `npm run check:content`  
Expected: FAIL，错误包含 `缺少字段 tags`。

- [ ] **Step 3: 扩展类型与站点配置**

在 `lib/content-types.ts` 中加入：

```ts
export type Workstream = {
  id: "harness" | "skills" | "training" | "recommendation";
  title: string;
  summary: string;
  href: string;
  tone: "blue" | "cyan" | "amber" | "violet";
};
```

为 `SiteProfile` 增加 `welcome`、`opportunityStatus`、`focusAreas` 和必填 `github`；为 `PostRecord` 增加 `tags: string[]`。

在 `content/site.ts` 中使用以下公开文案：

```ts
welcome: "欢迎来到我的空间",
role: "AI Infra 产品 · Agent Harness · 大模型训练平台",
opportunityStatus: "关注相关机会",
focusAreas: ["Agent Harness", "模型训练与实验治理", "Skill 与 Loop Engineering", "生成式推荐"],
github: "https://github.com/yinany79-alt",
```

同时导出四项 `workstreams`，分别链接 `/projects/agent-harness`、`/projects/agent-harness`、`/projects/llm-training-flow`、`/projects/generative-recommendation`，摘要只复用已确认项目事实。

- [ ] **Step 4: 为三篇文章补齐中文标签**

使用以下 frontmatter：

```yaml
# harness-is-a-system.mdx
tags: [Agent Harness, Skill, 评测]

# llm-training-product-model.mdx
tags: [大模型训练, 数据契约, 实验治理]

# generative-recommendation-infra.mdx
tags: [生成式推荐, CTR, 算法基础设施]
```

- [ ] **Step 5: 运行内容校验、类型相关构建并确认通过**

Run: `npm run check:content && npm run lint`  
Expected: 内容校验报告 6 篇项目/文章且 ESLint 无错误。

- [ ] **Step 6: 提交内容模型变更**

```bash
git add lib/content-types.ts content/site.ts content/posts scripts/validate-content.mjs
git commit -m "feat: structure profile and article metadata"
```

### Task 2: 将全站导航与内容外壳改为中文高密度结构

**Files:**
- Modify: `components/site-header.tsx`
- Modify: `components/content-shell.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `app/writing/page.tsx`
- Modify: `app/writing/[slug]/page.tsx`
- Modify: `app/resume/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/not-found.tsx`

**Interfaces:**
- Consumes: `siteProfile` from `content/site.ts`。
- Produces: 中文导航 `首页 / 项目 / 文章 / 简历 / 关于我`。
- Produces: `ContentShell` 新接口 `section: string`、`title: string`、`intro?: string`、`density?: "compact" | "article"`。

- [ ] **Step 1: 修改导航文案和移动端语义**

将 `components/site-header.tsx` 中的链接配置改为：

```ts
const links = [
  ["首页", "/"],
  ["项目", "/projects"],
  ["文章", "/writing"],
  ["简历", "/resume"],
  ["关于我", "/about"],
] as const;
```

保留 `ThemeToggle`，移动端通过 CSS 提供可横向滚动或紧凑菜单，不再用 `nth-child` 隐藏关键入口。

- [ ] **Step 2: 收敛 ContentShell 的巨大标题结构**

将 `eyebrow` 重命名为 `section`，为 `<main>` 增加 `data-density={density}`，页脚文案改为：

```tsx
<footer className="site-footer">
  <span>杨弋南 · 个人技术空间</span>
  <a href="/">返回首页 ↑</a>
</footer>
```

默认 `density="compact"`；文章详情使用 `density="article"`。

- [ ] **Step 3: 中文化项目、简历、关于我和 404 页面**

使用明确栏目文案：项目页 section 为“重点项目”、title 为“把复杂系统变成可运行的产品”；简历页 section 为“个人简历”、title 为“杨弋南”；关于页 section 为“关于我”、title 为“在技术与产品之间，建立可持续运行的系统”。各页面保留当前已经确认的 intro 与 children 内容。

项目详情、文章列表和文章详情同步把 `eyebrow` 调用改为 `section`，确保本任务结束时所有 `ContentShell` 调用都与新接口一致。简历页元数据标签改为“方向 01/02/03”和“教育经历”；About 卡片改为“我在做什么 / 我如何思考 / 教育经历”；404 操作改为“返回首页”。

- [ ] **Step 4: 运行 ESLint 和生产构建**

Run: `npm run lint && npm run build`  
Expected: ESLint 无错误；12 个路由完成预渲染。

- [ ] **Step 5: 提交中文导航与页面外壳**

```bash
git add components/site-header.tsx components/content-shell.tsx app/projects app/writing app/resume/page.tsx app/about/page.tsx app/not-found.tsx
git commit -m "feat: localize navigation and content shell"
```

### Task 3: 重构首页为技术工作台

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/control-room.tsx`
- Modify: `components/mode-selector.tsx`
- Modify: `components/topology-canvas.tsx`
- Modify: `components/home-continuation.tsx`
- Create: `components/current-work.tsx`
- Create: `components/opportunity-card.tsx`

**Interfaces:**
- Consumes: `siteProfile`、`workstreams`、`getProjects()`、`getPosts()`。
- Produces: `CurrentWork({ items }: { items: Workstream[] })`。
- Produces: `OpportunityCard({ status, focusAreas }: { status: string; focusAreas: string[] })`。
- Preserves: `ModeKey`、`TopologyCanvas({ mode, reducedMotion })` 与 `NodeDetail` 行为。

- [ ] **Step 1: 把首屏个人信息改成已确认顺序**

在 `components/control-room.tsx` 中把左侧信息替换为：欢迎语、衬线姓名、中文角色定位、个人表达、机会状态卡片和两个操作。操作链接固定为：

```tsx
<a className="primary-link" href={siteProfile.resumeHref}>查看简历</a>
<a className="secondary-link" href="#current-work">了解我的工作</a>
```

`OpportunityCard` 显示“关注相关机会”和四个关注方向，不增加联系方式或到岗信息。

- [ ] **Step 2: 将拓扑模式和标签中文化**

保留内部 key，把可见 label 改为：

```ts
{ key: "harness", index: "01", label: "智能体系统", ... }
{ key: "training", index: "02", label: "模型训练", ... }
{ key: "recommendation", index: "03", label: "生成式推荐", ... }
```

`ModeSelector` 的标题改为“技术关注图谱 / 03”。节点 ID 保留英文技术缩写，节点详情继续使用中文说明。

- [ ] **Step 3: 压缩拓扑画布并保持移动端可读**

将拓扑区从独立大列调整为首屏右侧主模块。`TopologyCanvas` 保留现有粒子算法，但按容器宽高重新计算密度上限；移动端降低粒子数量，节点按钮保持至少 44×44px 点击范围，标签不能超出视口。

- [ ] **Step 4: 新建“目前在做”区并重排首页后续内容**

`CurrentWork` 渲染四个 `workstreams`，每项显示编号、标题、摘要、状态色和“查看实践”链接。

`HomeContinuation` 调整为：

```tsx
<CurrentWork items={workstreams} />
<div className="home-projects"><ProjectList projects={projects.slice(0, 3)} /></div>
<div className="home-posts"><PostList posts={posts.slice(0, 6)} /></div>
<section className="home-profile-footer">...</section>
```

最后一区显示北京大学信息管理系、查看简历、GitHub，不渲染未确认邮箱。

- [ ] **Step 5: 运行内容校验、ESLint 和构建**

Run: `npm run check:content && npm run lint && npm run build`  
Expected: 所有命令通过，首页仍为静态路由，拓扑客户端组件正常打包。

- [ ] **Step 6: 提交首页工作台**

```bash
git add app/page.tsx components/control-room.tsx components/mode-selector.tsx components/topology-canvas.tsx components/home-continuation.tsx components/current-work.tsx components/opportunity-card.tsx
git commit -m "feat: rebuild homepage as technical workspace"
```

### Task 4: 把文章页改造成可筛选的中文日志流

**Files:**
- Modify: `app/writing/page.tsx`
- Modify: `app/writing/[slug]/page.tsx`
- Modify: `components/post-list.tsx`
- Create: `components/post-filter.tsx`
- Modify: `components/home-continuation.tsx`
- Modify: `lib/content.ts`

**Interfaces:**
- Consumes: `PostRecord.tags`、`PostRecord.publishedAt`、`PostRecord.readingMinutes`。
- Produces: `PostList({ posts, variant = "archive" }: { posts: PostRecord[]; variant?: "archive" | "compact" })`。
- Produces: `PostFilter({ posts }: { posts: PostRecord[] })`，内部状态为 `activeTag: string | null`。

- [ ] **Step 1: 增加稳定的标签集合函数**

在 `lib/content.ts` 中导出：

```ts
export function getPostTags(posts = getPosts()): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}
```

- [ ] **Step 2: 将 PostList 改为日期、标题、摘要、标签、阅读时间结构**

每条文章使用 `<article>` 和完整链接区域，日期格式显示为 `YYYY.MM.DD`，元信息显示“约 N 分钟”，标签使用可见中文文本。`compact` 变体减少摘要行数，用于首页；`archive` 变体显示完整 1–2 行摘要。

同步在 `components/home-continuation.tsx` 中把首页调用改为 `<PostList posts={posts.slice(0, 6)} variant="compact" />`。

- [ ] **Step 3: 实现无后端标签筛选**

`PostFilter` 使用按钮列表“全部 + 所有标签”，通过 `aria-pressed` 表示选中状态。过滤逻辑固定为：

```ts
const visiblePosts = activeTag
  ? posts.filter((post) => post.tags.includes(activeTag))
  : posts;
```

无匹配时显示“这个标签下还没有文章。”和“查看全部”按钮；点击清除 `activeTag`。

- [ ] **Step 4: 收敛文章列表页和文章详情页头部**

文章列表页使用：

```tsx
<ContentShell section="技术文章" title="文章" intro="记录我对数据、系统、评测与长期演进的理解。">
  <PostFilter posts={getPosts()} />
</ContentShell>
```

文章详情页使用中文 section、发布日期、阅读时间和标签；设置 `density="article"`，标题最大字号低于项目列表页首标题。

- [ ] **Step 5: 运行 ESLint 与构建验证筛选组件的静态兼容性**

Run: `npm run lint && npm run build`  
Expected: 无 hooks 或 hydration 错误；文章列表及 3 个文章详情路由完成预渲染。

- [ ] **Step 6: 提交文章日志流**

```bash
git add app/writing components/post-list.tsx components/post-filter.tsx components/home-continuation.tsx lib/content.ts
git commit -m "feat: turn writing archive into filterable journal"
```

### Task 5: 统一视觉系统、毛玻璃与微动效

**Files:**
- Modify: `app/globals.css`
- Create: `components/reveal.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/control-room.tsx`
- Modify: `components/home-continuation.tsx`
- Modify: `components/post-list.tsx`

**Interfaces:**
- Produces: `Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string })`。
- Preserves: `data-theme="light" | "planet"` 与 `themechange` 事件。

- [ ] **Step 1: 更新浅色与星球模式设计 token**

在现有 token 基础上加入：

```css
--site-accent-cyan: #08a7a0;
--site-accent-amber: #d97706;
--site-glass: rgb(255 255 255 / 72%);
--site-glass-border: rgb(88 104 130 / 18%);
--site-shadow: 0 18px 60px rgb(36 58 92 / 10%);
```

星球模式分别提供深色值。背景使用低对比度径向光晕与网格，正文和交互文字满足规格字号，不使用全页毛玻璃。

- [ ] **Step 2: 重做首屏与内容区布局样式**

实现桌面首屏左右结构、52–60px 衬线姓名、紧凑机会卡片、右侧拓扑和底部下一屏露出。为“目前在做”、重点项目、文章日志和经历联系区设置清晰的区块间距与背景层次。

- [ ] **Step 3: 限定毛玻璃使用范围**

只为 `.site-header`、`.opportunity-card`、`.node-sheet` 使用：

```css
background: var(--site-glass);
border: 1px solid var(--site-glass-border);
backdrop-filter: blur(18px) saturate(135%);
box-shadow: var(--site-shadow);
```

在不支持 `backdrop-filter` 时仍保留不透明度足够的背景色。

- [ ] **Step 4: 实现进入视口与页面过场**

`Reveal` 使用 `IntersectionObserver`，元素进入视口后设置 `data-visible="true"`，观察到后立即 `unobserve`。CSS 初始位移 12px、透明度 0，过渡 420ms；姓名与欢迎语使用 60–90ms 递增 delay。加入渐进增强：

```css
@view-transition { navigation: auto; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 180ms; }
```

- [ ] **Step 5: 为减少动态效果提供完整降级**

在 `prefers-reduced-motion: reduce` 下取消 reveal 位移、view transition、拓扑动画和 hover 位移，内容保持立即可见。

- [ ] **Step 6: 完成响应式和键盘焦点样式**

验证 1440px、1024px、768px、390px 四个宽度；移动端导航不隐藏关键链接，首屏改为单列，拓扑标签不溢出，按钮点击区域至少 44px，焦点环在两种主题下可见。

- [ ] **Step 7: 运行完整本地检查**

Run: `npm run check`  
Expected: 内容校验、ESLint、生产构建和 9 个关键产物检查全部通过。

- [ ] **Step 8: 提交视觉系统与动效**

```bash
git add app/globals.css app/layout.tsx components/reveal.tsx components/control-room.tsx components/home-continuation.tsx components/post-list.tsx
git commit -m "feat: refine visual system and motion"
```

### Task 6: 浏览器回归、文档收尾与双端发布

**Files:**
- Modify: `design-qa.md`
- Modify: `docs/superpowers/plans/2026-09-16-personal-site-information-density-redesign.md`
- Modify outside repo after successful release: `/Users/yangyinan.8/Desktop/Obsidian/Agent-Memory/projects/求职个人网站.md`

**Interfaces:**
- Consumes: Tasks 1–5 的完整构建产物。
- Produces: GitHub Pages 公网版本与 owner-only OpenAI Sites 备份版本。

- [ ] **Step 1: 启动连续本地预览并检查主要页面**

Run: `npm run dev`  
Check: `/`、`/projects`、一个项目详情、`/writing`、一个文章详情、`/resume`、`/about`。

- [ ] **Step 2: 执行桌面与移动端交互检查**

在 1440×900 和 390×844 下确认：中文导航、首屏信息、拓扑三模式、节点详情、文章标签筛选、空状态、简历下载入口、浅色/星球切换和刷新持久化。浏览器控制台不得出现 error 或 warn。

- [ ] **Step 3: 检查减少动态效果与键盘操作**

启用 `prefers-reduced-motion: reduce` 后确认内容立即可见且拓扑静态可读。仅使用 Tab、Enter 和 Space 完成导航、主题切换、标签筛选和拓扑节点详情操作。

- [ ] **Step 4: 记录设计 QA 结果**

在 `design-qa.md` 记录检查日期、页面、视口、两种主题、交互项、发现的问题与修复结论；只有所有阻塞项关闭后将结果标记为 `passed`。

- [ ] **Step 5: 再次运行发布门禁**

Run: `npm run check && git diff --check && git status --short`  
Expected: 检查全部通过；工作区只包含预期的 QA 和计划跟踪变更。

- [ ] **Step 6: 提交 QA 与计划完成状态**

```bash
git add design-qa.md docs/superpowers/plans/2026-09-16-personal-site-information-density-redesign.md
git commit -m "docs: verify personal site redesign"
```

- [ ] **Step 7: 发布 GitHub Pages 主站**

Push `main` 到 `git@github.com:yinany79-alt/yinany79-alt.github.io.git`，等待 Actions 完成后访问 `https://yinany79-alt.github.io/`，确认 HTML 含新版中文导航和默认浅色主题。

- [ ] **Step 8: 发布 OpenAI Sites 备份**

复用 `.openai/hosting.json` 中现有 `project_id`，构建、打包、保存新版本并按现有 owner-only 访问策略部署。部署成功后检查返回状态为 `succeeded`，不改变站点受众。

- [ ] **Step 9: 更新持久记忆并结束预览服务**

在 `Agent-Memory/projects/求职个人网站.md` 记录中文技术工作台、文章日志流、拓扑保留、动效边界与两个发布地址；没有新的未解决事项时不向 `agent/open-loops.md` 添加条目。停止本地预览服务，保留公网主站标签页作为交付视图。
