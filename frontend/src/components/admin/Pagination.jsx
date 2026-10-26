import { ChevronLeft, ChevronRight } from 'lucide-react';

const buttonClass =
  'inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400';

export default function Pagination({ page, totalPages, total, disabled, onPageChange }) {
  const pages = Math.max(totalPages, 1);

  return (
    <nav aria-label="Paginación de reservas" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-400" aria-live="polite">
        Página {page} de {pages}
        <span className="ml-2 text-slate-500">({total} {total === 1 ? 'reserva' : 'reservas'})</span>
      </p>
      <div className="flex gap-2">
        <button type="button" className={buttonClass} disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />
          Anterior
        </button>
        <button type="button" className={buttonClass} disabled={disabled || page >= pages} onClick={() => onPageChange(page + 1)}>
          Siguiente
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
