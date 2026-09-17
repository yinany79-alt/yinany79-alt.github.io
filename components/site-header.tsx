import { ThemeToggle } from "./theme-toggle";

const links = [["首页", "/"], ["项目", "/projects"], ["文章", "/writing"], ["简历", "/resume"], ["关于我", "/about"]] as const;

export function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="杨弋南 Yveson 个人技术站首页">杨弋南 <span>Yveson</span></a>
    <div className="site-header-actions">
      <nav className="site-nav" aria-label="主导航">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <ThemeToggle />
    </div>
  </header>;
}
