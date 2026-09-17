import { ContentShell } from "@/components/content-shell";
import { ExperienceList } from "@/components/experience-list";
import { experiences, siteProfile } from "@/content/site";

export default function AboutPage() {
  return <ContentShell section="关于我" title="在技术与产品之间，建立可持续运行的系统" intro={siteProfile.statement}><section className="about-grid"><div><small>我在做什么</small><p>我把模型训练、数据、调度、评测与 Agent 工具调用中分散的复杂度，转译为清晰的产品对象、操作流程和治理规则。</p></div><div><small>我如何思考</small><p>一个系统是否真正智能，不只看它能否完成一次任务，还要看它能否说明证据、处理失败、继续执行并通过评测稳定演进。</p></div></section><section className="experience-section" aria-labelledby="about-experience-title"><h2 id="about-experience-title">工作与教育经历</h2><ExperienceList items={experiences} /></section><section className="contact-line"><span>关注方向</span><strong>Agent Harness / 大模型训练平台 / AI Infra 产品</strong></section></ContentShell>;
}
