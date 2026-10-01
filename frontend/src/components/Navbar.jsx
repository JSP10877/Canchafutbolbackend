import { Link } from "react-router-dom";
import { Goal, Home, LayoutGrid, User } from "lucide-react";

const Navbar = ({ paginaActiva }) => {
  const navItem = (ruta, texto, icono, activa) => (
    <Link
      to={ruta}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
        activa
          ? "bg-green-500/15 text-green-400 border border-green-500/20 shadow-lg"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      {icono}
      <span className="font-semibold text-sm">{texto}</span>

      {activa && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-green-400 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/90 border-b border-green-500/10 shadow-2xl">
      <div className="max-w-7xl mx-auto h-24 px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-2xl opacity-30 group-hover:opacity-60 transition" />

            <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300">
              <Goal size={28} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-green-300 to-emerald-500 bg-clip-text text-transparent">
              FUTBOL 5
            </h1>
            <p className="text-[11px] tracking-[0.35em] text-green-400 uppercase">
              Sport Arena
            </p>
          </div>
        </Link>

        {/* MENÚ */}
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 px-4 py-3 rounded-3xl backdrop-blur-xl">

          {navItem("/", "Inicio", <Home size={18} />, paginaActiva === "inicio")}

          {navItem(
            "/canchas",
            "Canchas",
            <LayoutGrid size={18} />,
            paginaActiva === "canchas"
          )}

          {navItem(
            "/miperfil",
            "Mi Perfil",
            <User size={18} />,
            paginaActiva === "miperfil"
          )}
        </div>

        {/* CTA */}
        <Link
          to="/canchas"
          className="px-7 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-xl hover:scale-105 hover:shadow-green-500/30 transition-all duration-300"
        >
          Reservar ahora
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;