import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type NodeInfo = { id: string; title: string; description: string; evidence: string; href: string };

export function NodeDetail({ node, onClose }: { node: NodeInfo | null; onClose: () => void }) {
  return <Sheet open={Boolean(node)} onOpenChange={(open) => { if (!open) onClose(); }}><SheetContent className="node-sheet" aria-label={node ? `${node.title} 节点详情` : "节点详情"}>{node && <><SheetHeader className="p-0"><p className="mono text-[10px] tracking-[0.18em] text-[#777772]">SYSTEM NODE / {node.id}</p><SheetTitle>{node.title}</SheetTitle><SheetDescription>{node.description}</SheetDescription></SheetHeader><p className="node-sheet-copy">{node.evidence}</p><Link className="node-sheet-link" href={node.href} prefetch={false}>查看对应项目 ↗</Link></>}</SheetContent></Sheet>;
}
