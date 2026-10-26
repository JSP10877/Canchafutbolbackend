import { TriangleAlert } from 'lucide-react';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <TriangleAlert size={18} aria-hidden="true" className="shrink-0" />
      <p className="min-w-0 flex-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-400/40 px-3 py-1.5 font-medium text-red-100 hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
