# 杨弋南 · AI Infra

面向求职与长期技术表达的个人网站。首页采用 Agentic Control Room 交互视觉，内容区沉淀项目、技术文章、简历与个人介绍。

## 本地开发

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

完整验收：

```bash
npm run check
```

静态产物生成在 `dist/client`，可部署到任意静态托管服务。本项目的正式发布使用 OpenAI Sites，项目绑定信息保存在 `.openai/hosting.json`。

## 日常维护

- 个人定位、首页文案与简历路径：`content/site.ts`
- 项目案例：`content/projects/*.mdx`
- 技术文章：`content/posts/*.mdx`
- 可下载简历：`public/resume/yang-yinan-resume.pdf`
- 首页交互节点：`components/control-room.tsx`
- 全局视觉与响应式规则：`app/globals.css`

新增内容时复制同目录已有 `.mdx` 文件，修改 frontmatter 与正文即可。`slug` 必须唯一；文章设置 `draft: true` 时不会出现在列表中。提交前运行 `npm run check:content`，发布前运行完整的 `npm run check`。

## 内容边界

网站只呈现可公开、可复核的项目表达。不得写入内部地址、密钥、客户数据或无法证实的指标；联系信息尚未确认时保持为空，不使用占位邮箱。
