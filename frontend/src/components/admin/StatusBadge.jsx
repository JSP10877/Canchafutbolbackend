// El backend guarda "activa" y "cancelada"; en pantalla se dice "Confirmada".
const ESTADOS = {
  activa: { label: 'Confirmada', className: 'bg-green-500/15 text-green-300 ring-green-500/30' },
  cancelada: { label: 'Cancelada', className: 'bg-red-500/15 text-red-300 ring-red-500/30' },
};

export default function StatusBadge({ estado }) {
  const { label, className } = ESTADOS[estado] ?? {
    label: estado,
    className: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {label}
    </span>
  );
}
