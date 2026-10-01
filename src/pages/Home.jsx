import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ← Agregar esto
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const eventos = [
  {
    titulo: "🏆 Torneo Relámpago",
    desc: "Competencia rápida entre equipos locales.",
    fecha: "12 Marzo",
    hora: "7:00 PM",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200",
  },
  {
    titulo: "⚽ Liga Amateur",
    desc: "Inscripciones abiertas para equipos.",
    fecha: "20 Marzo",
    hora: "6:00 PM",
    img: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1200",
  },
  {
    titulo: "🔥 Partido de Exhibición",
    desc: "Show deportivo con jugadores invitados.",
    fecha: "30 Marzo",
    hora: "8:00 PM",
    img: "https://images.unsplash.com/photo-1543357480-c60d40007a3f?q=80&w=1200",
  },
];

const espacios = [
  {
    nombre: "Fútbol",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1400",
  },
  {
    nombre: "Pádel",
    img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1400",
  },
  {
    nombre: "Voleibol",
    img: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1400",
  },
  {
    nombre: "Basketball",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1400",
  },
  {
    nombre: "Tenis",
    img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1400",
  },
];

export default function Home() {
  const [eventoActual, setEventoActual] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const i = setInterval(() => {
      setEventoActual((p) => (p + 1) % eventos.length);
    }, 6000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-[#06110c] min-h-screen text-white">

      <Navbar paginaActiva="inicio" />

      {/* TOP BAR */}
      <div className="bg-green-500/80 backdrop-blur-md overflow-hidden whitespace-nowrap">
        <div className="animate-[scroll_40s_linear_infinite] inline-block px-4 py-2 font-medium">
          ⚽ Torneos activos · 🎾 Pádel disponible · 🏐 Voleibol abierto · 🔥 Reserva inmediata
        </div>
      </div>

      <main>



        {/* Banner principal - CORREGIDO */}
        <section 
          className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
          {/* Capa de degradado */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900"></div>

          <div className="relative text-center max-w-4xl px-6">
              <h2 className="text-6xl font-extrabold leading-tight">
                  Bienvenido a <span className="text-green-500">Futbol 5</span>
              </h2>
          </div>

        </section>



        {/* NUESTROS ESPACIOS */}
        <section className="py-12 bg-[#06110c]">
          <div className="container mx-auto px-6">

            <div className="text-center mb-14">
              <p className="text-green-400 tracking-[0.25em] text-xs mb-3">
                INSTALACIONES
              </p>

              <h2 className="text-4xl font-bold">
                Nuestros <span className="text-green-400">espacios</span>
              </h2>

              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Diseñados para diferentes disciplinas con estándares profesionales.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

              {espacios.map((e) => (
                <div
                  key={e.nombre}
                  onClick={() => navigate(`/canchas?deporte=${e.nombre}`)}
                  className="relative group rounded-3xl overflow-hidden h-[380px] cursor-pointer"
                >
                  <img
                    src={e.img}
                    alt={e.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06110c] via-black/50 to-transparent" />

                  {/* glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-green-500/10 blur-2xl" />

                  {/* borde hover */}
                  <div className="absolute inset-0 border border-white/5 group-hover:border-green-500/40 rounded-3xl transition-all duration-500" />

                  {/* contenido */}
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold mb-1">
                      {e.nombre}
                    </h3>

                    <p className="text-sm text-slate-300">
                      Espacio profesional
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>



        {/* SERVICIOS */}
        <section className="py-12 bg-[#07140f]">
          <div className="container mx-auto px-6">

            <div className="mb-14">
              <p className="text-green-400 tracking-[0.25em] text-xs mb-3">
                EXPERIENCIA COMPLETA
              </p>

              <h2 className="text-4xl font-bold">
                Más que reservar una cancha
              </h2>

              <p className="text-slate-400 mt-4 max-w-2xl">
                Diseñamos una experiencia deportiva completa para que solo te preocupes por jugar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* CARD 1 */}
              <div className="group bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-green-500/20 transition">
                  ⚡
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  Reserva instantánea
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Agenda tu cancha en segundos desde cualquier dispositivo.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="group bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-2xl mb-6">
                  💡
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  Iluminación premium
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Juega de noche con visibilidad profesional LED.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="group bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-2xl mb-6">
                  🚿
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  Vestuarios modernos
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Espacios cómodos y funcionales para antes y después del partido.
                </p>
              </div>

              {/* CARD 4 */}
              <div className="group bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-2xl mb-6">
                  🏆
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  Torneos y eventos
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Participa en competencias y eventos deportivos exclusivos.
                </p>
              </div>

            </div>
          </div>
        </section>



        {/* 🎯 EVENTOS SLIDESHOW (más integrado visualmente) */}
        <section className="py-12 bg-[#06110c]">

          <div className="container mx-auto px-6">

            <h2 className="text-3xl font-semibold mb-10 text-center">
              Próximos <span className="text-green-400">eventos</span>
            </h2>

            <div className="relative h-[520px] rounded-[2.5rem] overflow-hidden">

              {/* fondo dinámico */}
              <div
                key={eventoActual}
                className="absolute inset-0 transition-all duration-700 scale-105"
                style={{
                  backgroundImage: `url(${eventos[eventoActual].img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* capas suaves (clave del look premium) */}
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#06110c]/95 via-black/50 to-transparent"></div>

              {/* glow ambiental */}
              <div className="absolute -inset-20 bg-green-500/10 blur-[120px]" />

              {/* contenido */}
              <div className="relative h-full flex items-center px-10 md:px-20">

                {/* izquierda */}
                <button
                  onClick={() =>
                    setEventoActual((p) => p === 0 ? eventos.length - 1 : p - 1)
                  }
                  className="absolute left-6 p-3 rounded-full bg-black/30 border border-white/10 backdrop-blur-md hover:bg-green-500/20"
                >
                  ‹
                </button>

                <div className="max-w-xl">
                  <h3 className="text-4xl md:text-5xl font-black mb-4">
                    {eventos[eventoActual].titulo}
                  </h3>

                  <p className="text-slate-300 mb-6">
                    {eventos[eventoActual].desc}
                  </p>

                  <div className="flex gap-6 text-slate-300">
                    <span>📅 {eventos[eventoActual].fecha}</span>
                    <span>⏰ {eventos[eventoActual].hora}</span>
                  </div>
                </div>

                {/* derecha */}
                <button
                  onClick={() =>
                    setEventoActual((p) => (p + 1) % eventos.length)
                  }
                  className="absolute right-6 p-3 rounded-full bg-black/30 border border-white/10 backdrop-blur-md hover:bg-green-500/20"
                >
                  ›
                </button>

              </div>

              {/* indicadores */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {eventos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setEventoActual(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === eventoActual ? "w-10 bg-green-400" : "w-3 bg-white/30"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>



        {/* INFO (rediseñada tipo panel SaaS deportivo) */}
        <section className="py-12 bg-[#07140f]">
          <div className="container mx-auto px-6">

            <div className="mb-12 text-center">
              <h3 className="text-3xl font-semibold">
                Centro de <span className="text-green-400">operaciones</span>
              </h3>
              <p className="text-slate-400 mt-2">
                Todo lo que necesitas saber para reservar y jugar sin fricción.
              </p>
            </div>

            {/* PANEL PRINCIPAL */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-green-500/10 bg-black/30 backdrop-blur-xl">

              {/* glow ambiental */}
              <div className="absolute -inset-24 bg-green-500/10 blur-[120px]" />

              <div className="relative grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">

                {/* bloque 1 */}
                <div className="p-8">
                  <p className="text-green-400 text-sm tracking-widest mb-2">
                    HORARIOS
                  </p>
                  <h4 className="text-xl font-semibold">
                    7:00 AM – 11:00 PM
                  </h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Todos los días
                  </p>
                </div>

                {/* bloque 2 */}
                <div className="p-8">
                  <p className="text-green-400 text-sm tracking-widest mb-2">
                    UBICACIÓN
                  </p>
                  <h4 className="text-xl font-semibold">
                    Neiva, Huila
                  </h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Acceso central y fácil llegada
                  </p>
                </div>

                {/* bloque 3 */}
                <div className="p-8">
                  <p className="text-green-400 text-sm tracking-widest mb-2">
                    CONTACTO
                  </p>
                  <h4 className="text-xl font-semibold">
                    +57 300 123 4567
                  </h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Respuesta rápida WhatsApp
                  </p>
                </div>

                {/* bloque 4 */}
                <div className="p-8">
                  <p className="text-green-400 text-sm tracking-widest mb-2">
                    INFRAESTRUCTURA
                  </p>
                  <h4 className="text-xl font-semibold">
                    Premium + LED
                  </h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Césped profesional y vestuarios
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}