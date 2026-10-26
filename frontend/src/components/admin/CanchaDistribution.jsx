import { formatNumber } from '../../utils/format';

/**
 * Distribución de reservas por cancha. Las barras son decorativas: el número
 * y el porcentaje están siempre en texto, así que no depende del color.
 * `canchas` ya viene ordenada de mayor a menor desde la API.
 */
export default function CanchaDistribution({ canchas, loading }) {
  const max = canchas?.[0]?.reservas || 1;

  return (
    <section aria-labelledby="distribucion-titulo" className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 id="distribucion-titulo" className="text-lg font-semibold text-white">
        Reservas por cancha
      </h2>
      <p className="mt-1 text-sm text-slate-400">Todas las reservas confirmadas, de la más a la menos reservada.</p>

      {loading || !canchas ? (
        <div className="mt-6 space-y-4" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        <ul className="mt-6 gap-x-12 lg:columns-2">
          {canchas.map((cancha, index) => {
            const width = cancha.reservas > 0 ? Math.max((cancha.reservas / max) * 100, 3) : 0;
            const vacia = cancha.reservas === 0;

            return (
              <li key={cancha.canchaId} className="mb-4 break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className={vacia ? 'text-slate-500' : 'font-medium text-white'}>
                    {cancha.nombre}
                  </span>
                  <span className={`shrink-0 tabular-nums ${vacia ? 'text-slate-500' : 'text-slate-300'}`}>
                    {formatNumber(cancha.reservas)}
                    <span className="ml-2 text-slate-500">{cancha.porcentaje}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
                  <div
                    className={`h-full rounded-full ${index === 0 && !vacia ? 'bg-green-400' : 'bg-emerald-600/70'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
