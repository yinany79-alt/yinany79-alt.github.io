import { BriefcaseBusiness } from "lucide-react";

export function OpportunityCard({ status, focusAreas }: { status: string; focusAreas: string[] }) {
  return <aside className="opportunity-card" aria-label="当前关注方向">
    <div className="opportunity-heading"><span className="opportunity-dot" aria-hidden="true" /><BriefcaseBusiness size={15} /><strong>{status}</strong></div>
    <div className="opportunity-focus">{focusAreas.map((area) => <span key={area}>{area}</span>)}</div>
  </aside>;
}
