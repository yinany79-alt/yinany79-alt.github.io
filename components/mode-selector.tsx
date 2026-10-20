export type ModeKey = "harness" | "evaluation" | "training";
export type Mode = { key: ModeKey; index: string; label: string; activeNodes: string[] };

export function ModeSelector({ modes, active, onChange }: { modes: Mode[]; active: ModeKey; onChange: (mode: ModeKey) => void }) {
  return <aside className="mode-panel" aria-label="技术主线">
    <p className="mode-label">选择一条工作主线</p>
    <div className="mode-list">{modes.map((mode) => <button key={mode.key} className="mode-button" data-active={active === mode.key} aria-pressed={active === mode.key} onClick={() => onChange(mode.key)}><b>{mode.index}</b><span>{mode.label}</span><span aria-hidden="true">→</span></button>)}</div>
  </aside>;
}
