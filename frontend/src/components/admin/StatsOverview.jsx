import { CalendarDays, CalendarRange, Trophy, Wallet } from 'lucide-react';
import KpiCard from './KpiCard';
import { formatCurrency, formatDateShort, formatDuration, formatNumber } from '../../utils/format';

/** Las cuatro tarjetas de resumen. `stats` es null mientras carga por primera vez. */
export default function StatsOverview({ stats, loading }) {
  const lider = stats?.canchaMasReservada;

  return (
    <section aria-label="Resumen del negocio" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={CalendarDays}
        label="Reservas del día"
        loading={loading}
        value={stats && formatNumber(stats.hoy.reservas)}
        hint={stats && `${formatDuration(stats.hoy.horas)} por ${formatCurrency(stats.hoy.ingresos)}`}
      />
      <KpiCard
        icon={CalendarRange}
        label="Reservas de la semana"
        loading={loading}
        value={stats && formatNumber(stats.semana.reservas)}
        hint={stats && `Del ${formatDateShort(stats.semana.desde)} al ${formatDateShort(stats.semana.hasta)}`}
      />
      <KpiCard
        icon={Wallet}
        label="Ingresos acumulados"
        loading={loading}
        value={stats && formatCurrency(stats.acumulado.ingresos)}
        hint={stats && `${formatNumber(stats.acumulado.reservas)} reservas, a la tarifa actual`}
      />
      <KpiCard
        accent
        compact
        icon={Trophy}
        label="Cancha más reservada"
        loading={loading}
        value={stats && (lider ? lider.nombre : 'Aún no hay reservas')}
        hint={stats && lider && `${formatNumber(lider.reservas)} reservas (${lider.porcentaje}%)`}
      />
    </section>
  );
}
