export default function SelectorHora({
  horarios,
  ocupados,
  fecha,
  horaSeleccionada,
  setHoraSeleccionada
}) {
  if (!fecha) return null;

  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2">
        Horarios disponibles
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {horarios.map((hora) => {
          const ocupado = ocupados.includes(hora);

          return (
            <button
              key={hora}
              disabled={ocupado}
              onClick={() => setHoraSeleccionada(hora)}
              className={`p-2 rounded border
                ${ocupado
                  ? "bg-red-300 cursor-not-allowed"
                  : horaSeleccionada === hora
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {hora}
            </button>
          );
        })}
      </div>
    </div>
  );
}