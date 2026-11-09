import { useState } from 'react';
import { useAuth } from './AuthContext';
import { registrarSalida } from './authService';
import MiMembresia from './MiMembresia';
import MiAforo from './MiAforo';
import MisIngresos from './MisIngresos';
import './acceso.css';

const SECCIONES = [
  { id: 'inicio', etiqueta: '🏠 Inicio' },
  { id: 'membresia', etiqueta: '💳 Mi Membresía' },
  { id: 'aforo', etiqueta: '👥 Aforo' },
  { id: 'ingresos', etiqueta: '📋 Mis Ingresos' },
];

export default function UsuarioPage() {
  const { usuario, salir } = useAuth();
  const [seccion, setSeccion] = useState('inicio');
  const [oscuro, setOscuro] = useState(false);
  const [recargar, setRecargar] = useState(0);

  async function handleSalida() {
    const res = await registrarSalida(usuario);
    alert(res.mensaje || 'Salida registrada');
    setRecargar((n) => n + 1); // refresca el historial
  }

  return (
    <div className={`acc-layout ${oscuro ? 'acc-oscuro' : ''}`}>
      <aside className="acc-sidebar">
        <h2>🏋️ GymAssistant</h2>

        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={`acc-nav-btn ${seccion === s.id ? 'activo' : ''}`}
            onClick={() => setSeccion(s.id)}
          >
            {s.etiqueta}
          </button>
        ))}

        <button className="acc-nav-btn" onClick={() => setOscuro((v) => !v)}>
          🌙 Modo
        </button>

        <div className="acc-logout">
          <button className="acc-btn-logout" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="acc-main">
        <header className="acc-top">
          <h1>Mi Cuenta</h1>
          <p>
            {usuario.nombre}
            {usuario.tipoPersona && (
              <span className="acc-badge">{usuario.tipoPersona}</span>
            )}
          </p>
        </header>

        {seccion === 'inicio' && (
          <section className="acc-seccion">
            <div className="acc-welcome">
              <h2>Bienvenido, {usuario.nombre}</h2>
              <p>
                Consulta tus datos personales, el estado de tu membresía,
                el aforo y tus movimientos de ingreso al gimnasio.
              </p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Documento:</strong> {usuario.numeroDocumento || 'No disponible'}</p>
              <p><strong>Clasificación:</strong> {usuario.tipoPersona}</p>
              <button className="acc-btn-secondary" onClick={handleSalida}>
                Registrar salida
              </button>
            </div>
          </section>
        )}

        {seccion === 'membresia' && (
          <section className="acc-seccion">
            <h2>Mi Membresía</h2>
            <MiMembresia usuarioId={usuario.id} />
          </section>
        )}

        {seccion === 'aforo' && (
          <section className="acc-seccion">
            <h2>Aforo Actual</h2>
            <MiAforo />
          </section>
        )}

        {seccion === 'ingresos' && (
          <section className="acc-seccion">
            <h2>Mis Ingresos</h2>
            <MisIngresos usuarioId={usuario.id} recargar={recargar} />
          </section>
        )}
      </main>
    </div>
  );
}
