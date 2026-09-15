"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { siteProfile } from "@/content/site";
import { ModeSelector, type Mode, type ModeKey } from "./mode-selector";
import { NodeDetail, type NodeInfo } from "./node-detail";
import { SiteHeader } from "./site-header";
import { TopologyCanvas } from "./topology-canvas";

const modes: Mode[] = [
  { key: "harness", index: "01", label: "HARNESS", activeNodes: ["PLAN", "TOOL", "EVAL", "MEMORY"] },
  { key: "training", index: "02", label: "TRAINING", activeNodes: ["DATA", "TRAIN", "EVAL", "DEPLOY"] },
  { key: "recommendation", index: "03", label: "RECOMMENDATION", activeNodes: ["DATA", "TRAIN", "DEPLOY"] },
];

const nodes: (NodeInfo & { x: number; y: number })[] = [
  { id: "DATA", title: "Data Contract", description: "将数据格式、质量与训练范式之间的关系产品化。", evidence: "统一 Pretrain、SFT、DPO、KTO 与 GRPO 的数据类型，把截断、Packing、Mask 和预处理缓存变成可配置、可校验的平台规则。", href: "/projects/llm-training-flow", x: 15, y: 29 },
  { id: "TOOL", title: "Tool System", description: "让 Agent 可以安全、连续地操作训练平台。", evidence: "将 OpenAPI、SDK、CLI 和 30+ 原子能力组装为可观测、可恢复的工具链，打通配置、提交、监控与诊断。", href: "/projects/agent-harness", x: 73, y: 22 },
  { id: "PLAN", title: "Harness Planning", description: "从意图到证据，用状态和评测约束长任务。", evidence: "把执行抽象为意图识别、事实取证、计划生成、Tool 调用、结果校验和失败降级，并建立 Gold Set 和回归门禁。", href: "/projects/agent-harness", x: 48, y: 44 },
  { id: "MEMORY", title: "Loop Memory", description: "让成功和失败经验可以被下一次迭代使用。", evidence: "通过 Hook 记录调用与结果，将成功案例和失败 Case 纳入回归，形成调用观测、Case 沉淀、回归评测与版本优化闭环。", href: "/projects/agent-harness", x: 18, y: 69 },
  { id: "TRAIN", title: "Training Flow", description: "将算法配置转译为完整的训练产品流程。", evidence: "覆盖模型、数据、镜像、异构硬件、超参数、Checkpoint 和产物，并将分布式策略与风险提示前置。", href: "/projects/llm-training-flow", x: 51, y: 73 },
  { id: "EVAL", title: "Evaluation", description: "不只验证结果，也验证决策过程和系统稳定性。", evidence: "建设 Case、任务、结果和版本对比机制，支持自动评分、人工复核、Bad Case 回归、基线对比和灰度门禁。", href: "/projects/agent-harness", x: 83, y: 55 },
  { id: "DEPLOY", title: "Delivery", description: "让实验结果能被追溯、导出和复用。", evidence: "通过 AIFlow 编排数据、训练、评测、离线推理和模型导出，并以 MLflow 统一管理指标、参数、产物和实验对比。", href: "/projects/llm-training-flow", x: 89, y: 80 },
];

export function ControlRoom() {
  const [mode, setMode] = useState<ModeKey>("harness");
  const [selected, setSelected] = useState<NodeInfo | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = useMemo(() => new Set(modes.find((item) => item.key === mode)?.activeNodes), [mode]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const index = modes.findIndex((item) => item.key === mode);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setMode(modes[(index + delta + modes.length) % modes.length].key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  return <main className="control-room" id="top"><SiteHeader /><div className="control-grid"><section className="identity" aria-labelledby="hero-title"><p className="identity-kicker mono">HUMAN / IDEAS / SYSTEMS<br />A MORE CAPABLE TOMORROW</p><h1 id="hero-title">{siteProfile.name}<span className="sr-only"> / {siteProfile.nameEn}</span></h1><h2>{siteProfile.headline}</h2><p className="identity-role">{siteProfile.role}</p><p className="identity-copy">{siteProfile.statement}</p><div className="identity-actions"><Link className="primary-link" href="#archive" prefetch={false}>进入系统 <ArrowRight size={16} /></Link><Link className="secondary-link" href="/writing" prefetch={false}>阅读文章</Link></div></section><section className="topology-stage" aria-label="Agentic 系统拓扑"><TopologyCanvas mode={mode} reducedMotion={reducedMotion} />{nodes.map((node) => <button key={node.id} type="button" className="topology-node" style={{ left: `${node.x}%`, top: `${node.y}%` }} data-active={active.has(node.id)} aria-label={`打开 ${node.title} 详情`} onClick={() => setSelected(node)}><span>{node.id}</span></button>)}</section><ModeSelector modes={modes} active={mode} onChange={setMode} /></div><div className="status-bar">OBSERVE → BUILD → EVALUATE → EVOLVE</div><NodeDetail node={selected} onClose={() => setSelected(null)} /></main>;
}
