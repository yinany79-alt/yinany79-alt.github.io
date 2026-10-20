import type { ExperienceRecord, SiteProfile, Workstream } from "@/lib/content-types";

export const siteProfile: SiteProfile = {
  name: "杨弋南",
  nameEn: "Yveson",
  welcome: "欢迎来到我的空间",
  role: "AI Infra 产品经理 · 北京大学 · 京东零售",
  headline: "让复杂的技术，成为好用的产品。",
  statement: "我在做算法研发的 Agent 工作台、答疑与评测系统，以及模型训练工作流。这里记录我亲手构建的产品、做过的实验，和逐步形成的技术判断。",
  opportunityStatus: "关注机会",
  focusAreas: ["Agent Harness", "Agent 评测", "AI Infra 产品"],
  resumeHref: "/resume/yang-yinan-resume.pdf",
  github: "https://github.com/yinany79-alt",
};

export const workstreams: Workstream[] = [
  {
    id: "harness",
    title: "9N-Harness 与智能开发",
    summary: "把项目上下文、18 个 Skills、6 条 Workflow 与平台开放能力，组织成能推进实际任务的 Agent 工作台。",
    href: "/projects/agent-harness",
    tone: "blue",
  },
  {
    id: "evaluation",
    title: "答疑 Bot 与 Agent 评测",
    summary: "从问答架构、独立评测系统到 MiniCPM 垂域训推，用可复核的结果指导产品迭代。",
    href: "/projects/agent-evaluation",
    tone: "cyan",
  },
  {
    id: "training",
    title: "算法工作流平台",
    summary: "串起训练任务、AIFlow、MLflow 和 Notebook，让算法研发流程可复用、指标可追踪、任务可恢复。",
    href: "/projects/llm-training-flow",
    tone: "violet",
  },
];

export const experiences: ExperienceRecord[] = [
  { id: "jd", kind: "work", organization: "京东零售", unit: "AI Infra 与大数据计算部", title: "AI 产品经理", period: "2025–至今", logoSrc: "/brands/jd.png", logoAlt: "京东 Logo" },
  { id: "pku", kind: "education", organization: "北京大学", unit: "信息管理系", title: "信息管理与信息系统", detail: "本科", period: "2021–2025", logoSrc: "/brands/pku.png", logoAlt: "北京大学 Logo" },
];
