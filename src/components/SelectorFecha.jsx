export default function SelectorFecha({ fecha, setFecha, bloqueado }) {
  return (
    <div className="mt-4">
      <label className="block mb-2 font-semibold">
        Selecciona una fecha
      </label>

      <input
        type="date"
        className="border p-2 rounded w-full"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      {bloqueado && (
        <p className="text-red-500 mt-2">
          Este día no está disponible
        </p>
      )}
    </div>
  );
}