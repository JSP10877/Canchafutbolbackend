import { FilterX } from 'lucide-react';

const ESTADOS = [
  { value: 'todas', label: 'Todos los estados' },
  { value: 'activa', label: 'Confirmadas' },
  { value: 'cancelada', label: 'Canceladas' },
];

const controlClass =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white [color-scheme:dark] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400';

function QuickFilter({ label, active, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-green-400 bg-green-500/15 text-green-300'
          : 'border-white/10 text-slate-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="min-w-44 flex-1">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Filtros de la tabla. Es un componente "controlado": no guarda estado propio,
 * solo muestra `filters` y avisa los cambios con onChange({ ... }).
 * `today` y `week` vienen del servidor (zona horaria del negocio), no del
 * navegador, para que "Hoy" coincida con lo que cuentan las estadísticas.
 */
export default function ReservationFilters({ filters, canchas, today, week, onChange, onReset }) {
  const { desde, hasta, canchaId, estado } = filters;

  const sinFechas = !desde && !hasta;
  const esHoy = Boolean(today) && desde === today && hasta === today;
  const esSemana = Boolean(week) && desde === week.desde && hasta === week.hasta;
  const fechaUnica = desde && desde === hasta ? desde : '';
  const hayFiltros = !sinFechas || canchaId !== '' || estado !== 'todas';

  const canchasOrdenadas = [...(canchas ?? [])].sort((a, b) => a.canchaId - b.canchaId);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtros rápidos de fecha">
        <QuickFilter label="Todas las fechas" active={sinFechas} onClick={() => onChange({ desde: '', hasta: '' })} />
        <QuickFilter
          label="Hoy"
          active={esHoy}
          disabled={!today}
          onClick={() => onChange({ desde: today, hasta: today })}
        />
        <QuickFilter
          label="Esta semana"
          active={esSemana}
          disabled={!week}
          onClick={() => onChange({ desde: week.desde, hasta: week.hasta })}
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <Field label="Un día en particular" htmlFor="filtro-fecha">
          <input
            id="filtro-fecha"
            type="date"
            className={controlClass}
            value={fechaUnica}
            onChange={(event) => onChange({ desde: event.target.value, hasta: event.target.value })}
          />
        </Field>

        <Field label="Cancha" htmlFor="filtro-cancha">
          <select
            id="filtro-cancha"
            className={controlClass}
            value={canchaId}
            onChange={(event) => onChange({ canchaId: event.target.value })}
          >
            <option value="">Todas las canchas</option>
            {canchasOrdenadas.map((cancha) => (
              <option key={cancha.canchaId} value={cancha.canchaId}>
                {cancha.nombre}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estado" htmlFor="filtro-estado">
          <select
            id="filtro-estado"
            className={controlClass}
            value={estado}
            onChange={(event) => onChange({ estado: event.target.value })}
          >
            {ESTADOS.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </Field>

        {hayFiltros && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <FilterX size={16} aria-hidden="true" />
            Quitar filtros
          </button>
        )}
      </div>
    </div>
  );
}
