import { ContentShell } from "@/components/content-shell";
import { siteProfile } from "@/content/site";

export default function AboutPage() {
  return <ContentShell eyebrow="ABOUT / YANG YINAN" title="在技术与产品之间，建立可持续运行的系统" intro={siteProfile.statement}><section className="about-grid"><div><small>WHAT I DO</small><p>我把模型训练、数据、调度、评测与 Agent 工具调用中分散的复杂度，转译为清晰的产品对象、操作流程和治理规则。</p></div><div><small>HOW I THINK</small><p>一个系统是否真正智能，不只看它能否完成一次任务，还要看它能否说明证据、处理失败、继续执行并通过评测稳定演进。</p></div><div><small>EDUCATION</small><p><strong>北京大学信息管理系</strong><br />信息管理与信息系统</p></div></section><section className="contact-line"><span>OPEN TO CONVERSATIONS ABOUT</span><strong>Agent Harness / LLM Training Platform / AI Infra Product</strong></section></ContentShell>;
}
