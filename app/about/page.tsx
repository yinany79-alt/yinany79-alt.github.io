import { ContentShell } from "@/components/content-shell";
import { ExperienceList } from "@/components/experience-list";
import { ProfilePortrait } from "@/components/profile-portrait";
import { experiences, siteProfile } from "@/content/site";

export default function AboutPage() {
  return <ContentShell section="关于我" title="杨弋南，也可以叫我 Yveson。" intro={siteProfile.statement}><section className="about-profile" aria-label="杨弋南个人介绍"><ProfilePortrait name={siteProfile.nameEn} /><div className="about-profile-copy"><div><small>我在做什么</small><p>在京东零售做 AI Infra 产品。从 Agent 工作台与 Skill，到算法中台答疑 Bot、评测系统和算法工作流，关注模型与平台如何共同交付一个完整任务。</p></div><div><small>我如何工作</small><p>既做需求和产品设计，也亲手开发、部署和跑实验。我独立搭建过评测系统，也完成了 MiniCPM5-2B 的 SFT、模型服务与评测链路，用实践校准产品判断。</p></div></div></section><section className="experience-section" aria-labelledby="about-experience-title"><h2 id="about-experience-title">工作与教育经历</h2><ExperienceList items={experiences} /></section><section className="contact-line"><span>关注机会</span><strong>Agent Harness · Agent 评测 · AI Infra 产品</strong><a className="about-resume-link" href="/resume">阅读我的简历 ↗</a></section></ContentShell>;
}
