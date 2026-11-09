import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext(null);
const CLAVE = 'gym_sesion';
const INACTIVIDAD_MS = 5 * 60 * 1000;

export const RUTAS_POR_ROL = {
  admin: '/recepcion',
  usuario: '/usuario',
};

export const rutaInicio = (rol) => RUTAS_POR_ROL[rol] || '/login';

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);
  const temporizador = useRef(null);

  const entrar = useCallback((datos) => {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    setUsuario(datos);
  }, []);

  const salir = useCallback(() => {
    localStorage.removeItem(CLAVE);
    setUsuario(null);
  }, []);

  useEffect(() => {
    if (!usuario) return undefined;

    const reiniciar = () => {
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => {
        alert('La sesión se cerró por inactividad.');
        salir();
      }, INACTIVIDAD_MS);
    };

    const eventos = ['mousemove', 'keydown', 'click'];
    eventos.forEach((evento) => window.addEventListener(evento, reiniciar));
    reiniciar();

    return () => {
      clearTimeout(temporizador.current);
      eventos.forEach((evento) => window.removeEventListener(evento, reiniciar));
    };
  }, [usuario, salir]);

  return (
    <AuthContext.Provider value={{ usuario, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
