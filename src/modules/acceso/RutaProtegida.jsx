import { Navigate } from 'react-router-dom';
import { rutaInicio, useAuth } from './AuthContext';

// Uso: <RutaProtegida roles={['admin']}><Recepcion /></RutaProtegida>
// Sin sesión -> /login. Con sesión pero rol no permitido -> a su pantalla de inicio.
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={rutaInicio(usuario.rol)} replace />;
  }
  return children;
}
