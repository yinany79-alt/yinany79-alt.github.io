import type { ExperienceRecord, SiteProfile, Workstream } from "@/lib/content-types";

export const siteProfile: SiteProfile = {
  name: "杨弋南",
  nameEn: "YANG YINAN",
  welcome: "欢迎来到我的空间",
  role: "AI Infra 产品 · Agent Harness · 大模型训练平台",
  headline: "构建能工作的智能系统",
  statement: "我关心的不是让模型看起来更聪明，而是如何让复杂的训练与智能体系统真正可运行、可评测、可迭代。",
  opportunityStatus: "关注相关机会",
  focusAreas: ["Agent Harness", "模型训练与实验治理", "Skill 与 Loop Engineering", "生成式推荐"],
  resumeHref: "/resume/yang-yinan-resume.pdf",
  github: "https://github.com/yinany79-alt",
};

export const workstreams: Workstream[] = [
  {
    id: "harness",
    title: "Agent Harness 建设",
    summary: "围绕意图、状态、工具、证据与评测，让 Agent 能够安全、连续地操作训练平台。",
    href: "/projects/agent-harness",
    tone: "blue",
  },
  {
    id: "skills",
    title: "Skill 与 Loop Engineering",
    summary: "把能力封装、调用观测、Case 沉淀与回归评测组织为可以持续迭代的工程闭环。",
    href: "/projects/agent-harness",
    tone: "cyan",
  },
  {
    id: "training",
    title: "大模型训练与实验治理",
    summary: "从数据契约到训练、评测、推理与资产管理，建设可恢复、可追溯的产品流程。",
    href: "/projects/llm-training-flow",
    tone: "amber",
  },
  {
    id: "recommendation",
    title: "生成式推荐与算法基础设施",
    summary: "从 CTR 全链路出发，理解长序列、稀疏参数与新训练范式对平台能力的要求。",
    href: "/projects/generative-recommendation",
    tone: "violet",
  },
];

export const experiences: ExperienceRecord[] = [
  { id: "jd", kind: "work", organization: "京东零售", unit: "AI Infra 与大数据计算部", title: "AI 产品经理", period: "2025–至今", logoSrc: "/brands/jd.png", logoAlt: "京东 Logo" },
  { id: "pku", kind: "education", organization: "北京大学", unit: "信息管理系", title: "信息管理与信息系统", detail: "本科", period: "2021–2025", logoSrc: "/brands/pku.png", logoAlt: "北京大学 Logo" },
];
