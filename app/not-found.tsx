import Link from "next/link";

export default function NotFound() { return <main className="not-found"><p className="content-eyebrow">SYSTEM / 404</p><h1>这个节点还没有连接。</h1><Link className="primary-link" href="/" prefetch={false}>返回控制室</Link></main>; }
