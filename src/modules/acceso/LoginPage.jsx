import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { rutaInicio, useAuth } from './AuthContext';
import { crearPassword, iniciarSesion, USAR_SIMULADO } from './authService';
import './acceso.css';

export default function LoginPage() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Paso 2: primer ingreso (reemplaza el prompt() del HTML original)
  const [idPrimerIngreso, setIdPrimerIngreso] = useState(null);
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');

  if (usuario) return <Navigate to={rutaInicio(usuario.rol)} replace />;

  async function enviarLogin(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await iniciarSesion(correo, password);
      if (res.primerIngreso) {
        setIdPrimerIngreso(res.id);
        return;
      }
      entrar(res.usuario);
      navigate(rutaInicio(res.usuario.rol), { replace: true });
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  }

  async function enviarNuevaPassword(e) {
    e.preventDefault();
    setError('');
    if (nueva.length < 4) return setError('La contraseña debe tener al menos 4 caracteres');
    if (nueva !== confirmar) return setError('Las contraseñas no coinciden');

    setCargando(true);
    try {
      await crearPassword(idPrimerIngreso, nueva);
      setIdPrimerIngreso(null);
      setPassword('');
      setNueva('');
      setConfirmar('');
      setError('');
      alert('Contraseña creada. Ahora inicia sesión.');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="acc-login-body">
      <div className="acc-login-card">
        <h2>🏋️ GymAssistant</h2>

        {idPrimerIngreso === null ? (
          <form onSubmit={enviarLogin}>
            <p>Acceso al sistema</p>
            <input
              type="email"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoFocus
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="acc-btn-primary" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form onSubmit={enviarNuevaPassword}>
            <p>Es tu primer ingreso. Crea una contraseña.</p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
            <button className="acc-btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Crear contraseña'}
            </button>
          </form>
        )}

        {error && <p className="acc-error">{error}</p>}

        {USAR_SIMULADO && idPrimerIngreso === null && (
          <p className="acc-demo">
            Recepción: admin@gymassistant.com / 123456 · Usuarios de prueba: contraseña gym123
          </p>
        )}
      </div>
    </div>
  );
}
