import { SiteHeader } from "./site-header";

export function ContentShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return <main className="content-page"><SiteHeader /><div className="content-wrap"><header className="content-hero"><p className="content-eyebrow">{eyebrow}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</header>{children}<footer className="site-footer"><span>YANG YINAN / PERSONAL TECHNICAL ARCHIVE</span><a href="/">RETURN TO SYSTEM ↑</a></footer></div></main>;
}
