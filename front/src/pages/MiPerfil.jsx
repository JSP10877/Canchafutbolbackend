import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import fondo from "../assets/images/futbol.jpg";

export default function MiPerfil() {
  const { user, login, register, logout, updateUser } = useAuth();

  const [esLogin, setEsLogin] = useState(true);
  const [tab, setTab] = useState("perfil");
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [reservaAbierta, setReservaAbierta] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    nickname: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    nacimiento: "",
    password: ""
  });

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("reservas")) || [];
    setReservas(guardadas);
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || "",
        nickname: user.nickname || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || "",
        nacimiento: user.nacimiento || "",
        password: ""
      });
    }
  }, [user]);

  const hoy = new Date().toISOString().split("T")[0];

  const reservasUsuario = reservas
    .map((r, index) => ({ ...r, index }))
    .filter((r) => r.usuario === user?.nombre);

  const activas = reservasUsuario.filter(r => r.fecha >= hoy);
  const historial = reservasUsuario.filter(r => r.fecha < hoy);
  const ahora = new Date();

  const proximasReservas = activas.filter((r) => {
    const fechaReserva = new Date(`${r.fecha}T${r.hora}`);
    const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);

    return diferenciaHoras > 0 && diferenciaHoras <= 12;
  });



  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensaje("");

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(form.correo)) {
      setMensaje("❌ Por favor ingresa un correo válido");
      return;
    }

    if (esLogin) {
      const res = login({
        correo: form.correo,
        password: form.password
      });

      if (!res.ok) {
        setMensaje(res.msg);
        return;
      }

      setMensaje("✅ Sesión iniciada");
    } else {
      const res = register(form);

      if (!res.ok) {
        setMensaje(res.msg);
        return;
      }

      setMensaje("✅ Cuenta creada");
    }
  };


  const handleUpdate = () => {
    updateUser(form);
    setMensaje("✅ Perfil actualizado");
    setEditando(false);
  };

  const cancelarReserva = (indexReserva) => {
    const nuevasReservas = reservas.filter((_, i) => i !== indexReserva);

    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
    setReservas(nuevasReservas);
    setReservaAbierta(null);
    setMensaje("✅ Reserva cancelada correctamente");
  };

  const obtenerPrecio = (cancha) => {
    if (cancha.includes("Arena 5 Norte")) return 35000;
    if (cancha.includes("Arena 5 Sur")) return 45000;
    if (cancha.includes("Estadio Urbano")) return 48000;
    if (cancha.includes("Padel Cancha 1")) return 25000;
    if (cancha.includes("Padel Cancha 2")) return 25000;
    if (cancha.includes("Padel Cancha 3")) return 30000;
    return 35000;
  };

  return (
    <div className="relative min-h-screen text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondo})` }}
      />
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      <div className="relative z-10">
        <Navbar paginaActiva="miperfil" />

        <div className="max-w-6xl mx-auto p-6">

          {!user && (
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-6">
                {esLogin ? "Bienvenido" : "Crear cuenta"}
              </h2>

              <form onSubmit={manejarSubmit} className="space-y-4">

                {!esLogin && (
                  <>
                    <input
                      placeholder="Nombre completo"
                      onChange={e => setForm({ ...form, nombre: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                    />

                    <input
                      placeholder="Teléfono"
                      onChange={e => setForm({ ...form, telefono: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                    />
                  </>
                )}

                <input
                  type="email"
                  placeholder="Correo"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className={`w-full p-3 rounded-xl bg-white/10 border ${
                    mensaje.includes("correo")
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                  required
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                />

                <button className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold">
                  {esLogin ? "Entrar" : "Registrarse"}
                </button>
              </form>

              <p
                onClick={() => setEsLogin(!esLogin)}
                className="text-center mt-4 text-green-400 cursor-pointer"
              >
                {esLogin ? "Crear cuenta" : "Iniciar sesión"}
              </p>
            </div>
          )}

          {user && (
            <>
              {proximasReservas.length > 0 && (
                <div className="mb-6 bg-yellow-500/15 border border-yellow-400 rounded-3xl p-5 animate-pulse shadow-xl">
                  <h3 className="text-yellow-300 font-bold text-xl mb-3">
                    ⏰ Recordatorio de reserva
                  </h3>

                  {proximasReservas.map((r, i) => (
                    <div key={i} className="mb-2">
                      <p className="font-semibold text-white">
                        {r.cancha}
                      </p>

                      <p className="text-yellow-200 text-sm">
                        {r.fecha} • {r.hora}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-6">

              {/* HEADER */}
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-green-400">
                    {user.nombre}
                  </h2>
                  <p className="text-slate-300">@{user.nickname || "usuario"}</p>
                  <p className="text-slate-400">{user.correo}</p>
                </div>

                <button
                  onClick={logout}
                  className="bg-red-500/80 hover:bg-red-600 px-5 py-2 rounded-xl"
                >
                  Cerrar sesión
                </button>
              </div>

              {/* TABS */}
              <div className="flex gap-3 bg-white/5 backdrop-blur p-2 rounded-full w-fit border border-white/10">
                {["perfil", "reservas", "Billetera"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-full capitalize transition ${
                      tab === t
                        ? "bg-green-500"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* PERFIL */}
              {tab === "perfil" && (
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                      Información personal
                    </h3>

                    <button
                      onClick={() => {
                        if (editando) handleUpdate();
                        else setEditando(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl"
                    >
                      {editando ? "Guardar" : "Editar"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      ["nombre", "Nombre"],
                      ["nickname", "Nickname"],
                      ["correo", "Correo"],
                      ["telefono", "Teléfono"],
                      ["direccion", "Dirección"],
                      ["ciudad", "Ciudad"]
                    ].map(([campo, label]) => (
                      <input
                        key={campo}
                        disabled={!editando}
                        value={form[campo]}
                        placeholder={label}
                        onChange={(e) =>
                          setForm({ ...form, [campo]: e.target.value })
                        }
                        className="p-4 rounded-xl bg-white/10 border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* RESERVAS */}
              {tab === "reservas" && (
                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10">
                    <h3 className="text-green-400 font-bold mb-4">
                      Reservas activas
                    </h3>

                    {activas.length === 0 ? (
                      <p className="text-slate-400">
                        No tienes reservas activas
                      </p>
                    ) : (
                      activas.map((r, i) => {
                        const abierta = reservaAbierta === i;
                        const precioHora = obtenerPrecio(r.cancha);
                        const duracion = r.duracion || 2;
                        const total = precioHora * duracion;

                        return (
                          <div key={i} className="bg-white/10 rounded-2xl mb-3 overflow-hidden">
                            <button
                              onClick={() => setReservaAbierta(abierta ? null : i)}
                              className="w-full p-4 flex justify-between"
                            >
                              <div className="text-left">
                                <p>{r.cancha}</p>
                                <p className="text-sm text-slate-400">
                                  {r.fecha} • {r.hora}
                                </p>
                              </div>

                              <span>{abierta ? "−" : "+"}</span>
                            </button>

                            {abierta && (
                              <div className="p-4 border-t border-white/10">
                                <p>{duracion} horas</p>
                                <p>
                                  {r.hora} - {parseInt(r.hora) + duracion}:00
                                </p>
                                <p>${precioHora.toLocaleString()} / hora</p>

                                <p className="text-yellow-400 font-bold mt-2">
                                  Total: ${total.toLocaleString()}
                                </p>

                                <button
                                  onClick={() => cancelarReserva(r.index)}
                                  className="mt-4 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl"
                                >
                                  Cancelar reserva
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10">
                    <h3 className="text-slate-400 font-bold mb-4">
                      Historial
                    </h3>

                    {historial.length === 0 ? (
                      <p>Sin historial</p>
                    ) : (
                      historial.map((r, i) => (
                        <div key={i} className="bg-white/10 p-4 rounded-xl mb-2 opacity-60">
                          <p>{r.cancha}</p>
                          <p>{r.fecha} • {r.hora}</p>
                          <p>{r.duracion || 2} horas</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Billetera */}
              {tab === "Billetera" && (
                              <div className="relative overflow-hidden rounded-3xl shadow-2xl">

                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-slate-900" />

                                <div className="relative z-10 p-10">

                                  <div className="flex justify-between items-start mb-10">
                                    <div>
                                      <p className="text-sm uppercase tracking-widest text-white/70">
                                        Crédito disponible
                                      </p>

                                      <h2 className="text-6xl font-bold mt-3">
                                        ${user.Billetera || 0}
                                      </h2>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-white/70 text-sm">
                                        Estado
                                      </p>
                                      <p className="font-semibold text-green-300">
                                        Cuenta activa
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">

                                    <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
                                      <h4 className="font-bold mb-2">
                                        Solicitar recarga
                                      </h4>
                                      <p className="text-sm text-white/70">
                                        Para añadir saldo comunícate con administración o realiza una recarga presencial.
                                      </p>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
                                      <h4 className="font-bold mb-2">
                                        Última operación
                                      </h4>
                                      <p className="text-sm text-white/70">
                                        No hay movimientos recientes
                                      </p>
                                    </div>

                                  </div>

                                  <button
                                    className="mt-8 w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:scale-[1.01] transition"
                                  >
                                    Solicitar recarga de crédito
                                  </button>

                                </div>
                              </div>
                            )}

              {mensaje && (
                <p className={`text-center mt-4 font-medium ${
                  mensaje.includes("❌")
                    ? "text-red-400"
                    : "text-green-400"
                }`}>
                  {mensaje}
                </p>
              )}

            </div>
           </>
          )}
        </div>
      </div>
    </div>
  );
}