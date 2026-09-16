import { ArrowUpRight } from "lucide-react";
import type { Workstream } from "@/lib/content-types";

export function CurrentWork({ items }: { items: Workstream[] }) {
  return <section className="home-section current-work" id="current-work" aria-labelledby="current-work-title">
    <div className="section-heading"><span id="current-work-title">目前在做</span><span>{String(items.length).padStart(2, "0")} 个方向</span></div>
    <div className="workstream-grid">{items.map((item, index) => <a className="workstream-card" data-tone={item.tone} href={item.href} key={item.id}>
      <span className="workstream-index">0{index + 1}</span>
      <strong>{item.title}</strong>
      <p>{item.summary}</p>
      <span className="workstream-link">查看实践 <ArrowUpRight size={15} /></span>
    </a>)}</div>
  </section>;
}
