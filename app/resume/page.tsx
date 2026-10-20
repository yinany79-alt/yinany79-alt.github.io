import { Download } from "lucide-react";
import { ContentShell } from "@/components/content-shell";
import { ExperienceList } from "@/components/experience-list";
import { experiences, siteProfile } from "@/content/site";

const groups = [
  { title: "9N-Harness 与智能开发", copy: "18 个 Skills、6 条算法 Workflow、OpenAPI/SDK/CLI 与跨环境开发链路。", href: "/projects/agent-harness" },
  { title: "答疑 Bot 建设与评测", copy: "三轮架构迭代，独立开发上线评测系统，完成 MiniCPM5-2B 垂域训推与端到端评测。", href: "/projects/agent-evaluation" },
  { title: "算法工作流平台", copy: "Tritium/Magnus 训练链路、AIFlow 编排、MLflow 指标中心与 Notebook 研发环境。", href: "/projects/llm-training-flow" },
];

export default function ResumePage() {
  return <ContentShell section="个人简历" title="杨弋南 · Yveson" intro="AI Infra 产品经理。把平台能力组织成可用的 Agent 产品，用真实实验和评测推动迭代。"><div className="resume-download"><a className="download-link" href={siteProfile.resumeHref} download><Download size={17} />下载双页中文简历</a><span>V9 · 2026.10 更新 · PDF</span></div><section className="resume-summary">{groups.map((group, index) => <div key={group.title}><span>方向 0{index + 1}</span><h2>{group.title}</h2><p>{group.copy}</p><a href={group.href}>阅读项目详情 ↗</a></div>)}</section><section className="experience-section" aria-labelledby="resume-experience-title"><h2 id="resume-experience-title">工作与教育经历</h2><ExperienceList items={experiences} /></section></ContentShell>;
}
