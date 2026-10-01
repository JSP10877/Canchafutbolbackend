import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userActivo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (usuario) => {
    localStorage.setItem("userActivo", JSON.stringify(usuario));
    setUser(usuario);
  };

  // REGISTRO
  const register = ({ nombre, correo, telefono, password }) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const correoLimpio = correo.trim().toLowerCase();

    const existe = usuarios.find(
      (u) => u.correo.toLowerCase() === correoLimpio
    );

    if (existe) {
      return { ok: false, msg: "El correo ya está registrado" };
    }

    const nuevoUsuario = {
      nombre,
      correo: correoLimpio,
      telefono,
      password: password.trim(),
      wallet: 0
    };

    localStorage.setItem(
      "usuarios",
      JSON.stringify([...usuarios, nuevoUsuario])
    );

    saveUser(nuevoUsuario);

    return { ok: true };
  };

  // LOGIN
  const login = ({ correo, password }) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const correoLimpio = correo.trim().toLowerCase();

    const encontrado = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === correoLimpio &&
        u.password === password.trim()
    );

    if (!encontrado) {
      return { ok: false, msg: "Credenciales incorrectas" };
    }

    saveUser(encontrado);
    return { ok: true };
  };

  // ACTUALIZAR PERFIL
  const updateUser = (data) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const nuevosUsuarios = usuarios.map((u) =>
      u.correo === user.correo ? { ...u, ...data } : u
    );

    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));

    const actualizado = { ...user, ...data };
    saveUser(actualizado);
  };

  const addBalance = (amount) => {
    const nuevoSaldo = (user.wallet || 0) + amount;
    updateUser({ wallet: nuevoSaldo });
  };

  const logout = () => {
    localStorage.removeItem("userActivo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        addBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}