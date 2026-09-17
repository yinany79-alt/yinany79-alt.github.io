import { Download } from "lucide-react";
import { ContentShell } from "@/components/content-shell";
import { ExperienceList } from "@/components/experience-list";
import { experiences, siteProfile } from "@/content/site";

const groups = [{ title: "Agent Harness", copy: "Harness 架构、Skill 体系、Loop Engineering、Agent 评测与智能开发链路。" }, { title: "LLM Training Flow", copy: "数据契约、Pretrain/SFT/RL、分布式训练、AIFlow 编排与 MLflow 实验治理。" }, { title: "Recommendation Infra", copy: "CTR 全链路、OneRec/HSTU GR、长序列、稀疏参数与异构训练基础设施。" }];

export default function ResumePage() {
  return <ContentShell section="个人简历" title="杨弋南" intro="AI Infra 产品经理，关注 Agent Harness、大模型训练平台与生成式推荐。"><a className="download-link" href={siteProfile.resumeHref} download><Download size={17} />下载双页中文简历</a><section className="resume-summary">{groups.map((group, index) => <div key={group.title}><span>方向 0{index + 1}</span><h2>{group.title}</h2><p>{group.copy}</p></div>)}</section><section className="experience-section" aria-labelledby="resume-experience-title"><h2 id="resume-experience-title">工作与教育经历</h2><ExperienceList items={experiences} /></section></ContentShell>;
}
