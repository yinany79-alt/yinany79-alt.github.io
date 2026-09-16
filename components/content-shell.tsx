import { SiteHeader } from "./site-header";

export function ContentShell({ section, title, intro, density = "compact", children }: { section: string; title: string; intro?: string; density?: "compact" | "article"; children: React.ReactNode }) {
  return <main className="content-page" data-density={density}><SiteHeader /><div className="content-wrap"><header className="content-hero"><p className="content-eyebrow">{section}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</header>{children}<footer className="site-footer"><span>杨弋南 · 个人技术空间</span><a href="/">返回首页 ↑</a></footer></div></main>;
}
