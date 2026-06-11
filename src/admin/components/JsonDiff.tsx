interface Props { previous: unknown; next: unknown; }

export default function JsonDiff({ previous, next }: Props) {
  const fmt = (v: unknown) => {
    try { return JSON.stringify(v, null, 2); } catch { return String(v); }
  };
  return (
    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Previous</div>
        <pre className="p-3 rounded bg-rose-50 border border-rose-100 text-rose-900 overflow-auto max-h-96 whitespace-pre-wrap">{previous == null ? "—" : fmt(previous)}</pre>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">New</div>
        <pre className="p-3 rounded bg-emerald-50 border border-emerald-100 text-emerald-900 overflow-auto max-h-96 whitespace-pre-wrap">{next == null ? "—" : fmt(next)}</pre>
      </div>
    </div>
  );
}
