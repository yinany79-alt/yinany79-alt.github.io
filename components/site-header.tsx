import Link from "next/link";

const links = [["PROJECTS", "/projects"], ["WRITING", "/writing"], ["RESUME", "/resume"], ["ABOUT", "/about"]] as const;

export function SiteHeader() {
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="杨弋南个人技术站首页">YANG YINAN</Link>
    <nav className="site-nav" aria-label="主导航">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
  </header>;
}
