export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <div className="reveal-block" style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</div>;
}
