const ModalReserva = ({ cancha, alCerrar }) => {
  if (!cancha) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Imagen de la cancha */}
        <div className="h-64 w-full overflow-hidden relative">
          <img 
            src={cancha.imagen_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"} 
            className="w-full h-full object-cover"
            alt={cancha.nombre}
          />
          <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-[#1e293b] to-transparent w-full">
            <h2 className="text-4xl font-bold text-green-400">{cancha.nombre}</h2>
          </div>
        </div>

        <div className="p-8">
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            {cancha.descripcion}
          </p>

          {/* Medidas y Capacidad (Ejemplo estático como tu imagen) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <span className="text-green-500 font-bold block mb-1">Medidas</span>
              <span className="text-white">25m x 15m</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <span className="text-green-500 font-bold block mb-1">Capacidad</span>
              <span className="text-white">10 jugadores</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-8">
            <span className="text-green-500 font-bold block mb-1">Servicios</span>
            <span className="text-white text-sm">Iluminación LED, vestuarios, balón incluido, marcador, zona de descanso</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-2xl font-bold">
              Precio: <span className="text-green-400">${cancha.precio_por_hora} / hora</span>
            </p>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={alCerrar}
                className="flex-1 md:flex-none px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-colors"
              >
                Cerrar
              </button>
              <button className="flex-1 md:flex-none px-8 py-3 bg-green-500 hover:bg-green-600 text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20">
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalReserva;