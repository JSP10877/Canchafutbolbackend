import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';

/** Lo que ve un usuario con sesión pero sin rol de administrador. */
export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
          <ShieldCheck size={28} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Acceso denegado</h1>
        <p className="mt-3 text-slate-400">
          Esta sección es solo para administradores. Si crees que deberías tener acceso, pídeselo al
          responsable del negocio.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-2xl bg-green-500 px-6 py-3 font-semibold text-slate-950 hover:bg-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
