import { useCallback, useState } from 'react';
import { CircleCheck, RefreshCw, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import CanchaDistribution from '../components/admin/CanchaDistribution';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import ErrorBanner from '../components/admin/ErrorBanner';
import Pagination from '../components/admin/Pagination';
import ReservationFilters from '../components/admin/ReservationFilters';
import ReservationsTable from '../components/admin/ReservationsTable';
import StatsOverview from '../components/admin/StatsOverview';
import { useAdminReservations } from '../hooks/useAdminReservations';
import { useAdminStats } from '../hooks/useAdminStats';
import { cancelReservation } from '../services/adminService';
import { formatDate } from '../utils/format';

const PAGE_SIZE = 10;
const INITIAL_FILTERS = { desde: '', hasta: '', canchaId: '', estado: 'todas' };

export default function Admin() {
  const stats = useAdminStats();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const reservations = useAdminReservations({ ...filters, page, limit: PAGE_SIZE });

  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [notice, setNotice] = useState('');

  const hasFilters =
    Boolean(filters.desde || filters.hasta) || filters.canchaId !== '' || filters.estado !== 'todas';

  // Cada cambio de filtro vuelve a la página 1 (la página 3 de otro filtro podría no existir).
  const changeFilters = (changes) => {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
    setNotice('');
  };
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };
  const refreshAll = () => {
    stats.refetch();
    reservations.refetch();
  };

  const closeDialog = useCallback(() => {
    setPendingCancel(null);
    setCancelError('');
  }, []);

  const confirmCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      await cancelReservation(pendingCancel.id);
      setPendingCancel(null);
      setNotice('Reserva cancelada. El horario quedó libre para otros clientes.');

      // Si era la última fila de la página y solo se listan las confirmadas,
      // esa página queda vacía: se retrocede una en vez de mostrar "sin resultados".
      const quedaVacia = (reservations.data?.reservations.length ?? 0) <= 1 && page > 1;
      if (filters.estado === 'activa' && quedaVacia) setPage((current) => current - 1);
      else reservations.refetch();
      stats.refetch();
    } catch (error) {
      setCancelError(error.message);
    } finally {
      setCancelling(false);
    }
  };

  const today = stats.data?.fecha;
  const week = stats.data?.semana;
  const pagination = reservations.data?.pagination;
  const tableFailedWithoutData = Boolean(reservations.error) && !reservations.data;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar paginaActiva="admin" />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Panel de administración</h1>
            <p className="mt-1 text-slate-400">
              {today ? `Hoy es ${formatDate(today)}` : 'Reservas y métricas del negocio'}
            </p>
          </div>
          <button
            type="button"
            onClick={refreshAll}
            disabled={stats.loading || reservations.loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <RefreshCw
              size={16}
              aria-hidden="true"
              className={stats.loading || reservations.loading ? 'animate-spin' : undefined}
            />
            Actualizar
          </button>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
          >
            <CircleCheck size={18} aria-hidden="true" className="shrink-0" />
            <p className="flex-1">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Cerrar aviso"
              className="rounded-lg p-1 hover:bg-green-500/20 focus-visible:outline-2 focus-visible:outline-green-300"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {stats.error && <ErrorBanner message={stats.error.message} onRetry={stats.refetch} />}

        <StatsOverview stats={stats.data} loading={stats.loading && !stats.data} />
        <CanchaDistribution canchas={stats.data?.porCancha} loading={stats.loading && !stats.data} />

        <section aria-labelledby="reservas-titulo" className="space-y-4">
          <h2 id="reservas-titulo" className="text-lg font-semibold">
            Historial de reservas
          </h2>

          <ReservationFilters
            filters={filters}
            canchas={stats.data?.porCancha}
            today={today}
            week={week}
            onChange={changeFilters}
            onReset={resetFilters}
          />

          {reservations.error && (
            <ErrorBanner message={reservations.error.message} onRetry={reservations.refetch} />
          )}

          {!tableFailedWithoutData && (
            <ReservationsTable
              reservations={reservations.data?.reservations ?? null}
              loading={reservations.loading}
              today={today}
              hasFilters={hasFilters}
              onCancel={setPendingCancel}
              onClearFilters={resetFilters}
            />
          )}

          {pagination && pagination.total > 0 && (
            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              disabled={reservations.loading}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>

      {pendingCancel && (
        <ConfirmDialog
          title="¿Cancelar esta reserva?"
          description={`Se cancelará la reserva de ${pendingCancel.cliente?.nombre ?? 'un usuario eliminado'} en ${pendingCancel.cancha.nombre}, el ${formatDate(pendingCancel.fecha)} de ${pendingCancel.horaInicio} a ${pendingCancel.horaFin}. El horario quedará libre y esta acción no se puede deshacer.`}
          confirmLabel="Sí, cancelar reserva"
          cancelLabel="Mantener reserva"
          loading={cancelling}
          error={cancelError}
          onConfirm={confirmCancel}
          onCancel={closeDialog}
        />
      )}
    </div>
  );
}
