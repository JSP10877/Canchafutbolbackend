/**
 * Tarjeta de indicador. `accent` la resalta (se usa solo para el dato más
 * importante del panel); `compact` reduce el tamaño del valor cuando es texto
 * largo, como el nombre de una cancha.
 */
export default function KpiCard({ icon, label, value, hint, loading = false, accent = false, compact = false }) {
  const Icon = icon; // los componentes en JSX deben empezar con mayúscula

  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-slate-900/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            accent ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-slate-300'
          }`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <h3 className="text-sm font-medium text-slate-300">{label}</h3>
      </div>

      {loading ? (
        <div className="mt-4 h-9 w-28 animate-pulse rounded-lg bg-white/10" aria-hidden="true" />
      ) : (
        <>
          <p
            className={`mt-4 font-bold tabular-nums text-white ${
              compact ? 'text-xl leading-tight' : 'text-3xl'
            }`}
          >
            {value}
          </p>
          {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
        </>
      )}
    </div>
  );
}
