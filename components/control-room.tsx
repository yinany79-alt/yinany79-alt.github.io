"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { siteProfile, workstreams } from "@/content/site";
import { ModeSelector, type Mode, type ModeKey } from "./mode-selector";
import { NodeDetail, type NodeInfo } from "./node-detail";
import { OpportunityCard } from "./opportunity-card";
import { TopologyCanvas } from "./topology-canvas";

const modes: Mode[] = [
  { key: "harness", index: "01", label: "智能开发", activeNodes: ["PLAN", "TOOL", "MEMORY"] },
  { key: "evaluation", index: "02", label: "答疑与评测", activeNodes: ["PLAN", "EVAL", "TRAIN", "MEMORY"] },
  { key: "training", index: "03", label: "算法工作流", activeNodes: ["DATA", "TRAIN", "EVAL", "DEPLOY"] },
];

const nodes: (NodeInfo & { x: number; y: number })[] = [
  { id: "DATA", title: "数据与实验", description: "一次实验要能说清输入、配置与结果。", evidence: "以模型、训练任务与实验指标组织研发过程，通过 AIFlow 和 MLflow 串起工作流执行、指标存取和实验对比。", href: "/projects/llm-training-flow", x: 15, y: 29 },
  { id: "TOOL", title: "工具与 Skill", description: "将平台能力接入 Agent 工作台。", evidence: "18 个 Skills、6 条算法 Workflow 与 30+ 原子能力，连接代码检查、资源查询、训练提交和持续监控。", href: "/projects/agent-harness", x: 73, y: 22 },
  { id: "PLAN", title: "任务规划", description: "从用户目标走向可以检查的执行过程。", evidence: "9N-Harness 根据项目上下文选择 Skill 与 Workflow；答疑 Bot 通过多路由 Harness 组织意图识别、取证、调用和校验。", href: "/projects/agent-harness", x: 48, y: 44 },
  { id: "MEMORY", title: "反馈与迭代", description: "让一次执行的经验，进入下一次改进。", evidence: "通过 Hook 记录调用，把失败 Case 与成功方案回流回归验证，连接版本对比、灰度发布与运行监控。", href: "/projects/agent-harness", x: 18, y: 69 },
  { id: "TRAIN", title: "训练与调优", description: "从模型实验走到可使用的服务。", evidence: "完成 MiniCPM5-2B 全参 SFT、Checkpoint 对照、BF16 导出与 vLLM 服务部署；后续计划推进 RL。", href: "/projects/agent-evaluation", x: 51, y: 73 },
  { id: "EVAL", title: "端到端评测", description: "把系统质量变成可以复核的结果。", evidence: "独立完成评测系统数据库、前后端开发与部署，支持端到端任务评测、轨迹多维评分、人工复核和版本对比。", href: "/projects/agent-evaluation", x: 83, y: 55 },
  { id: "DEPLOY", title: "工作流交付", description: "让研发过程能够复用、恢复和追溯。", evidence: "AIFlow 编排开发、训练、评估和发布；MLflow 持久化指标与实验记录；Notebook 提供交互式开发环境。", href: "/projects/llm-training-flow", x: 89, y: 80 },
];

const paths: Record<ModeKey, string[]> = {
  harness: ["理解项目", "选择 Skill", "执行任务", "记录结果"],
  evaluation: ["提出问题", "取证诊断", "端到端评测", "版本迭代"],
  training: ["开发调试", "编排任务", "训练评估", "对比交付"],
};

export function ControlRoom() {
  const [mode, setMode] = useState<ModeKey>("harness");
  const [selected, setSelected] = useState<NodeInfo | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = useMemo(() => new Set(modes.find((item) => item.key === mode)?.activeNodes), [mode]);
  const current = workstreams.find((item) => item.id === mode)!;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return <section className="control-room" data-mode={mode} id="top" aria-labelledby="hero-title">
    <div className="control-grid">
      <section className="identity">
        <div className="identity-name-lockup">
          <p className="identity-welcome">{siteProfile.welcome}</p>
          <div className="identity-names"><h1 id="hero-title">{siteProfile.name}</h1><p className="identity-signature" aria-label={`英文名 ${siteProfile.nameEn}`}>{siteProfile.nameEn}</p></div>
          <p className="identity-role">{siteProfile.role}</p>
        </div>
        <h2>{siteProfile.headline.split("，").map((line, index) => <span key={line}>{index === 0 ? `${line}，` : line}</span>)}</h2>
        <p className="identity-copy">{siteProfile.statement}</p>
        <div className="identity-actions"><a className="primary-link" href="/resume">阅读简历 <ArrowRight size={16} /></a><a className="secondary-link" href="#current-work">探索我的工作 <ArrowRight size={16} /></a></div>
        <OpportunityCard status={siteProfile.opportunityStatus} focusAreas={siteProfile.focusAreas} />
      </section>
      <section className="topology-workspace" aria-label="工作主线交互图谱">
        <div className="topology-heading"><span>我的工作，如何连接</span><span>点击节点探索 ↗</span></div>
        <div className="topology-stage"><TopologyCanvas mode={mode} reducedMotion={reducedMotion} />{nodes.map((node) => <button key={node.id} type="button" className="topology-node" style={{ left: `${node.x}%`, top: `${node.y}%` }} data-active={active.has(node.id)} data-label-side={node.x > 68 ? "left" : "right"} aria-label={`打开 ${node.title} 详情`} onClick={() => setSelected(node)}><span>{node.title}</span></button>)}</div>
        <ModeSelector modes={modes} active={mode} onChange={(next) => { setMode(next); setSelected(null); }} />
        <div className="mode-story" aria-live="polite" aria-atomic="true"><div className="mode-story-content" key={mode}><a href={current.href}>{current.title}<ArrowRight size={15} /></a><p>{current.summary}</p><ol className="mode-steps" aria-label="工作流程">{paths[mode].map((step) => <li key={step}>{step}</li>)}</ol></div></div>
      </section>
    </div>
    <div className="status-bar"><span>构建 · 验证 · 持续迭代</span><a href="#current-work">向下阅读 ↓</a></div>
    <NodeDetail node={selected ? { ...selected, href: selected.id === "PLAN" || selected.id === "MEMORY" || (selected.id === "TRAIN" && mode === "training") ? current.href : selected.href } : null} onClose={() => setSelected(null)} />
  </section>;
}
