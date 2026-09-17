import type { ExperienceRecord } from "@/lib/content-types";

export function ExperienceList({ items, compact = false }: { items: ExperienceRecord[]; compact?: boolean }) {
  return <section className="experience-list" data-compact={compact} aria-label="工作与教育经历">{items.map((item) => <article className="experience-item" data-experience-id={item.id} key={item.id}>
    <div className="experience-logo">
      {/* Local brand assets stay untransformed so their color and transparency remain exact. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.logoSrc} alt={item.logoAlt} />
    </div>
    <div className="experience-copy"><span>{item.kind === "work" ? "工作经历" : "教育经历"}</span><h3>{item.organization}</h3><p>{item.unit}</p><strong>{item.title}{item.detail ? ` · ${item.detail}` : ""}</strong></div>
    <span className="experience-period">{item.period}</span>
  </article>)}</section>;
}
