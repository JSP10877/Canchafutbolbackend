import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar la sesión guardada en la cookie al recargar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/profile", {
          credentials: "include"
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user || data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // REGISTRO
  const register = async ({ nombre, correo, password }) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre,
          correo: correo.trim().toLowerCase(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, msg: data.message || "Error al crear la cuenta" };
      }

      setUser(data.user || data);
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: "No se pudo conectar con el servidor" };
    }
  };

  // LOGIN
  const login = async ({ correo, password }) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, msg: data.message || "Credenciales incorrectas" };
      }

      setUser(data.user || data);
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: "No se pudo conectar con el servidor" };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  };

  // ACTUALIZAR PERFIL (Si la API soporta actualización de usuario)
  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const addBalance = (amount) => {
    if (user) {
      const nuevoSaldo = (user.wallet || 0) + amount;
      updateUser({ wallet: nuevoSaldo });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        addBalance
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}