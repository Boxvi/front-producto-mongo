// src/components/StatCard.jsx
const ACCENTS = {
  mint:   'bg-mint',
  yellow: 'bg-yellow-200 dark:bg-yellow-500/20 dark:bg-yellow-500/20',
  coral:  'bg-coral/40 dark:bg-coral/20',
  sky:    'bg-sky-200 dark:bg-sky-500/20 dark:bg-sky-500/20',
  lilac:  'bg-violet-200 dark:bg-violet-500/20 dark:bg-violet-500/20',
};

export default function StatCard({ label, value, detail, accent = 'mint', icon, trend }) {
  const c = ACCENTS[accent] || ACCENTS.mint;
  return (
    <div className={`flex items-center gap-3 rounded-2xl ${c.bg} p-4`}>
      {icon && (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card/60 text-lg ${c.icon}`}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">{label}</p>
        <p className="mt-0.5 font-display text-xl font-bold leading-tight text-ink">{value}</p>
        <p className="mt-0.5 truncate text-[11px] font-medium text-ink/60">
          {detail}
          {trend && <span className="ml-1 text-emerald-700">{trend}</span>}
        </p>
      </div>
    </div>
  );
}