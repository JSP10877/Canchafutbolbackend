import { Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate, formatDuration } from '../../utils/format';

const HEADERS = ['Cliente', 'Cancha', 'Fecha y horario', 'Valor', 'Estado', 'Acciones'];

function SkeletonRows() {
  return Array.from({ length: 5 }, (_, row) => (
    <tr key={row} className="border-t border-white/5" aria-hidden="true">
      {HEADERS.map((header) => (
        <td key={header} className="px-4 py-4">
          <div className="h-4 w-full max-w-32 animate-pulse rounded bg-white/10" />
        </td>
      ))}
    </tr>
  ));
}

/**
 * Tabla de reservas. Solo presenta datos: la carga, los filtros y la
 * cancelación los maneja la página que la usa.
 * `today` (del servidor) decide si todavía se puede cancelar una reserva.
 */
export default function ReservationsTable({ reservations, loading, today, hasFilters, onCancel, onClearFilters }) {
  const empty = reservations && reservations.length === 0 && !loading;

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60"
      aria-busy={loading}
    >
      <table className="w-full min-w-[860px] text-left text-sm">
        <caption className="sr-only">Historial de reservas de todos los clientes</caption>
        <thead>
          <tr className="text-slate-400">
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={loading && reservations ? 'opacity-60' : undefined}>
          {!reservations && loading && <SkeletonRows />}

          {empty && (
            <tr className="border-t border-white/5">
              <td colSpan={HEADERS.length} className="px-4 py-14 text-center">
                <Inbox size={32} className="mx-auto text-slate-500" aria-hidden="true" />
                <p className="mt-3 font-medium text-white">No hay reservas para mostrar</p>
                <p className="mt-1 text-slate-400">
                  {hasFilters ? 'Prueba con otros filtros.' : 'Cuando los clientes reserven, aparecerán aquí.'}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 rounded-xl border border-white/10 px-4 py-2 font-medium text-slate-200 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
                  >
                    Quitar filtros
                  </button>
                )}
              </td>
            </tr>
          )}

          {reservations?.map((reserva) => {
            const cancelada = reserva.estado === 'cancelada';
            const puedeCancelar = reserva.estado === 'activa' && (!today || reserva.fecha >= today);

            return (
              <tr key={reserva.id} className="border-t border-white/5 align-top">
                <td className="px-4 py-3">
                  {reserva.cliente ? (
                    <>
                      <p className="font-medium text-white">{reserva.cliente.nombre}</p>
                      <p className="text-slate-400">{reserva.cliente.correo}</p>
                      <p className="text-slate-400">{reserva.cliente.telefono || 'Sin teléfono'}</p>
                    </>
                  ) : (
                    <p className="text-slate-500">Usuario eliminado</p>
                  )}
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium text-white">{reserva.cancha.nombre}</p>
                  <p className="text-slate-400">{reserva.cancha.deporte}</p>
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium capitalize text-white">{formatDate(reserva.fecha)}</p>
                  <p className="tabular-nums text-slate-400">
                    {reserva.horaInicio} - {reserva.horaFin} ({formatDuration(reserva.duracionHoras)})
                  </p>
                </td>

                <td className={`px-4 py-3 tabular-nums ${cancelada ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {formatCurrency(reserva.total)}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge estado={reserva.estado} />
                </td>

                <td className="px-4 py-3">
                  {puedeCancelar && (
                    <button
                      type="button"
                      onClick={() => onCancel(reserva)}
                      aria-label={`Cancelar la reserva de ${reserva.cliente?.nombre ?? 'usuario eliminado'} del ${formatDate(reserva.fecha)}`}
                      className="rounded-lg px-3 py-1.5 font-medium text-red-300 hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
