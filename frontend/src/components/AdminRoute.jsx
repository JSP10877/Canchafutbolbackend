import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

/**
 * Protege la ruta /admin en el navegador:
 *  - sin sesión            -> va a /miperfil (ahí está el inicio de sesión)
 *  - sesión sin rol admin  -> pantalla de "Acceso denegado"
 *  - admin                 -> muestra la página
 *
 * Esto es solo experiencia de usuario. La seguridad real está en el backend:
 * /api/admin/* responde 401/403 a quien no sea administrador, aunque alguien
 * manipule el frontend.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Verificando sesión...
      </div>
    );
  }

  if (!user) return <Navigate to="/miperfil" replace />;
  if (user.role !== 'admin') return <AccessDenied />;

  return children;
}
