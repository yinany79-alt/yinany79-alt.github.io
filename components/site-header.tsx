import { ThemeToggle } from "./theme-toggle";

const links = [["PROJECTS", "/projects"], ["WRITING", "/writing"], ["RESUME", "/resume"], ["ABOUT", "/about"]] as const;

export function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="杨弋南个人技术站首页">YANG YINAN</a>
    <div className="site-header-actions">
      <nav className="site-nav" aria-label="主导航">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <ThemeToggle />
    </div>
  </header>;
}
