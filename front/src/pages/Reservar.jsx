import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { reservasMock } from "../data/reservasMock";
import { useAuth } from "../context/AuthContext";

import canchasfutbol from "../assets/images/futbol.jpg";
import canchaspadel from "../assets/images/padel.jpg";
import canchasvoleibol1 from "../assets/images/canchavoleibol.jpg";
import canchasvoleibol2 from "../assets/images/canchapisovoleibol.jpg";
import canchasbasket from '../assets/images/canchabasket.jpg';
import canchastenis from '../assets/images/canchatenis.jpg';

const infoCanchas = {
  1: { nombre: "Arena 5 Norte", precio: 35000, imagen: canchasfutbol },
  2: { nombre: "Arena 5 Sur", precio: 45000, imagen: canchasfutbol },
  3: { nombre: "Estadio Urbano", precio: 48000, imagen: canchasfutbol },
  4: { nombre: "Padel Cancha 1", precio: 25000, imagen: canchaspadel },
  5: { nombre: "Padel Cancha 2", precio: 25000, imagen: canchaspadel },
  6: { nombre: "Padel Cancha 3", precio: 30000, imagen: canchaspadel },
  7: { nombre: "Voleibol Arena 1", precio: 35000, imagen: canchasvoleibol1 },
  8: { nombre: "Voleibol Piso", precio: 35000, imagen: canchasvoleibol2 },
  9: { nombre: "Voleibol Arena 2", precio: 30000, imagen: canchasvoleibol1 },
  10: {nombre: "Tenis Court 1", precio: 40000, imagen: canchastenis },
  11: { nombre: "Tenis Court 2", precio: 42000, imagen: canchastenis },
  12: { nombre: "Basket Arena 1", precio: 38000, imagen: canchasbasket},
  13: { nombre: "Basket Arena 2", precio: 40000, imagen: canchasbasket },
};

export default function Reservar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const cancha = infoCanchas[id];
  const data = reservasMock[id] || reservasMock[1];

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [duracionReserva, setDuracionReserva] = useState(1);
  const [toast, setToast] = useState({
    show: false,
    text: "",
  });
  const [mensajeHorario, setMensajeHorario] = useState("");

  if (!cancha) return <p className="text-white p-6">Cancha no encontrada</p>;

  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split("T")[0];
  const horaActual = hoy.getHours();

  const bloqueado = data.noDisponibles.includes(fecha);
  const totalReserva = cancha.precio * duracionReserva;

  const reservasGuardadas =
    JSON.parse(localStorage.getItem("reservas")) || [];

  const generarHorarios = () => {
    if (!fecha) return [];

    const dia = new Date(fecha).getDay();
    const inicio = dia === 0 || dia === 6 ? 7 : 8;
    const cierre = dia === 0 || dia === 6 ? 24 : 23;

    let horarios = [];

    for (let i = inicio; i < cierre; i++) {
      horarios.push(i);
    }

    if (fecha === fechaHoy) {
      horarios = horarios.filter((h) => h > horaActual);
    }

    return horarios;
  };

  const horariosDisponibles = generarHorarios();

  // SOLO pinta rojo los bloques ocupados reales
  const ocupadoPorCruce = (horaNum) => {
    return reservasGuardadas.some((r) => {
      if (String(r.canchaId) !== String(id) || r.fecha !== fecha) return false;

      const inicio = parseInt(r.hora.split(":")[0]);
      const fin = inicio + (r.duracion || 2);

      return horaNum >= inicio && horaNum < fin;
    });
  };





  // valida si la nueva reserva choca
  const reservaSeCruza = (horaInicio) => {
    return reservasGuardadas.some((r) => {
      if (String(r.canchaId) !== String(id) || r.fecha !== fecha) return false;

      const inicioExistente = parseInt(r.hora.split(":")[0]);
      const finExistente = inicioExistente + (r.duracion || 2);
      const nuevoFin = horaInicio + duracionReserva;

      return horaInicio < finExistente && nuevoFin > inicioExistente;
    });
  };


  const guardarReserva = () => {
    if (!user) return;

    if (!fecha || !hora) {
      setToast({
        show: true,
        text: "Selecciona fecha y hora",
      });

      setTimeout(() => {
        setToast({ show: false, text: "" });
      }, 2500);
      return;
    }

    const nuevaReserva = {
      idReserva: Date.now(),
      usuario: user.nombre,
      canchaId: id,
      cancha: cancha.nombre,
      fecha,
      hora,
      duracion: duracionReserva,
    };

    localStorage.setItem(
      "reservas",
      JSON.stringify([...reservasGuardadas, nuevaReserva])
    );

    setToast({
      show: true,
      text: "Reserva confirmada. Revísala en tu perfil.",
    });

    setTimeout(() => {
      navigate("/miperfil");
    }, 2500);
  };

  return (
    <div className="relative min-h-screen text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cancha.imagen})` }}
      />
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      <div className="relative z-10">
        <Navbar paginaActiva="reservas" />

        <div className={`max-w-5xl mx-auto p-6 ${!user ? "blur-sm pointer-events-none" : ""}`}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={cancha.imagen} className="w-full h-72 object-cover" alt={cancha.nombre} />

            <div className="p-8">
              <h1 className="text-4xl font-bold text-green-400">{cancha.nombre}</h1>
              <p className="text-xl text-yellow-400 mt-2 font-semibold">
                ${cancha.precio.toLocaleString()} / hora
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Selecciona tu reserva</h2>

            {/* FECHA */}
            <div className="mt-6">
              <label className="block mb-3 text-slate-300 font-medium">
                Fecha de reserva
              </label>

              <div
                onClick={() => document.getElementById("fechaReserva")?.showPicker()}
                className={`group relative overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 ${
                  fecha
                    ? "border-green-400 bg-gradient-to-r from-green-500/10 to-emerald-500/5"
                    : "border-white/10 bg-white/5 hover:border-green-400"
                }`}
              >
                <input
                  id="fechaReserva"
                  type="date"
                  min={fechaHoy}
                  value={fecha}
                  onChange={(e) => {
                    setFecha(e.target.value);
                    setHora("");
                    setToast({ show: false, text: "" });
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">
                      {fecha ? "Fecha seleccionada" : "Selecciona tu día"}
                    </p>

                    <p className="text-xl font-semibold capitalize">
                      {fecha
                        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-CO", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Haz clic para elegir"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-green-500">📅</div>
                </div>
              </div>
            </div>

            {mensajeHorario && (
              <div className="mt-5 p-4 rounded-2xl bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-center">
                {mensajeHorario}
              </div>
            )}

            {/* DURACIÓN */}
            {fecha && (
              <div className="mt-6">
                <label className="block mb-3 text-slate-300 font-medium">
                  Horas a reservar
                </label>

                <div className="flex gap-3 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDuracionReserva(d);
                        setHora("");
                      }}
                      className={`px-5 py-3 rounded-xl ${
                        duracionReserva === d
                          ? "bg-green-500"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {d} {d === 1 ? "hora" : "horas"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HORARIOS */}
            {fecha && !bloqueado && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Horarios disponibles
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {horariosDisponibles.map((horaNum) => {
                    const h = `${horaNum.toString().padStart(2, "0")}:00`;

                    const ocupado = ocupadoPorCruce(horaNum);
                    const cruceReserva = !ocupado && reservaSeCruza(horaNum);

                    const dia = new Date(fecha).getDay();
                    const horaCierre = dia === 0 || dia === 6 ? 24 : 23;

                    const horaSeleccionada = hora
                      ? parseInt(hora.split(":")[0])
                      : null;

                    const dentroDelRango =
                      !ocupado &&
                      horaSeleccionada !== null &&
                      horaNum >= horaSeleccionada &&
                      horaNum < horaSeleccionada + duracionReserva;

                    return (
                      <button
                        key={h}
                        disabled={false}


                        onClick={() => {
                          const dia = new Date(fecha).getDay();
                          const horaCierre = dia === 0 || dia === 6 ? 24 : 23;

                          let nuevaHora = horaNum;
                          let mensajeAuto = "";

                          // si excede cierre
                          if (horaNum + duracionReserva > horaCierre) {
                            nuevaHora = horaCierre - duracionReserva;
                            mensajeAuto = "⚠️ Excede horario, ajustado automáticamente";
                          }

                          // si se cruza
                          while (nuevaHora >= 8 && reservaSeCruza(nuevaHora)) {
                            nuevaHora--;
                            mensajeAuto = "⚠️ Se cruza con otra reserva, ajustado automáticamente";
                          }


                          if (nuevaHora < 8) {
                            setMensajeHorario("❌ No hay espacio disponible");
                            setTimeout(() => setMensajeHorario(""), 5000);
                            return;
                          }

                          setHora(`${nuevaHora.toString().padStart(2, "0")}:00`);

                          if (mensajeAuto) {
                            setMensajeHorario(mensajeAuto);
                            setTimeout(() => setMensajeHorario(""), 5000);
                          }
                        }}


                        className={`p-4 rounded-2xl font-semibold transition-all ${
                          dentroDelRango
                            ? "bg-green-500 scale-105 shadow-lg"
                            : ocupado
                            ? "bg-red-500/50 cursor-not-allowed"
                            : cruceReserva
                            ? "bg-slate-300/40 hover:bg-slate-300/60"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {`${horaNum}:00 - ${horaNum + 1}:00`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RESUMEN */}
            {hora && (
              <div className="mt-8 bg-white/10 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold text-green-400 mb-3">Resumen</h3>

                <p>{cancha.nombre}</p>
                <p>{fecha}</p>
                <p>
                  {hora} - {parseInt(hora.split(":")[0]) + duracionReserva}:00
                </p>

                <p className="text-slate-300 mt-2">
                  ${cancha.precio.toLocaleString()} x {duracionReserva} horas
                </p>

                <p className="text-yellow-400 font-bold mt-3 text-xl">
                  Total: ${totalReserva.toLocaleString()}
                </p>
              </div>
            )}

            {hora && (
              <button
                onClick={guardarReserva}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-green-500/30"
              >
                Confirmar reserva
              </button>
            )}
          </div>
        </div>

        {/* TOAST VISUAL */}
        {toast.show && (
          <div className="fixed top-24 right-6 z-[9999] animate-[fadeIn_.4s_ease]">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-green-500/40 shadow-2xl rounded-2xl px-6 py-5 flex items-center gap-4 min-w-[340px]">

              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold">
                ✓
              </div>

              <div>
                <h4 className="font-bold text-green-400 text-lg">
                  Reserva exitosa
                </h4>
                <p className="text-slate-300 text-sm">
                  {toast.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl text-center max-w-md border border-white/10">
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                Acceso requerido
              </h2>

              <Link
                to="/miperfil"
                className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-2xl font-bold transition"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}