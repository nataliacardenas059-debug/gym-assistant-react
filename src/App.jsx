import { useState } from 'react';
import RegistroAccesos from './components/RegistroAccesos';
import AforoActual from './components/AforoActual';
import HistorialIngresos from './components/HistorialIngresos';
import HorariosAdministrativos from './components/HorariosAdministrativos';
import GestionPersonas from './pages/GestionPersonas';

function App() {
  const [seccionActiva, setSeccionActiva] = useState('Inicio');

  const menu = [
    { nombre: 'Inicio', icono: 'bi-house-door' },
    { nombre: 'Registro de accesos', icono: 'bi-person-check' },
    { nombre: 'Aforo actual', icono: 'bi-people' },
    { nombre: 'Historial de ingresos', icono: 'bi-clock-history' },
    { nombre: 'Horarios administrativos', icono: 'bi-calendar-check' },
    { nombre: 'Gestión de personas', icono: 'bi-people-fill' },
  ];

  const opciones = [
    {
      titulo: 'Registrar entrada',
      descripcion: 'Registrar el ingreso de un usuario',
      icono: 'bi-box-arrow-in-right',
      color: 'success',
      seccion: 'Registro de accesos',
    },
    {
      titulo: 'Registrar salida',
      descripcion: 'Registrar la salida de un usuario',
      icono: 'bi-box-arrow-right',
      color: 'primary',
      seccion: 'Registro de accesos',
    },
    {
      titulo: 'Consultar historial',
      descripcion: 'Revisar los movimientos registrados',
      icono: 'bi-clock-history',
      color: 'warning',
      seccion: 'Historial de ingresos',
    },
    {
      titulo: 'Ver horarios',
      descripcion: 'Consultar horarios administrativos',
      icono: 'bi-calendar-week',
      color: 'info',
      seccion: 'Horarios administrativos',
    },
    {
      titulo: 'Gestionar personas',
      descripcion: 'Registrar y consultar usuarios del gimnasio',
      icono: 'bi-people-fill',
      color: 'primary',
      seccion: 'Gestión de personas',
    },
  ];

  return (
    <div className="recepcion-app">

      {/* Menú lateral */}
      <aside className="recepcion-sidebar">
        <div className="sidebar-brand">
          <i className="bi bi-heart-pulse-fill"></i>
          <div>
            <h5>GYM ASSISTANT</h5>
            <small>Administración</small>
          </div>
        </div>

        <div className="sidebar-label">MENÚ PRINCIPAL</div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <button
              key={item.nombre}
              className={`sidebar-link ${
                seccionActiva === item.nombre ? 'active' : ''
              }`}
              onClick={() => setSeccionActiva(item.nombre)}
            >
              <i className={`bi ${item.icono}`}></i>
              <span>{item.nombre}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <i className="bi bi-person-circle"></i>
          <div>
            <strong>Recepcionista</strong>
            <small>Panel de recepción</small>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="recepcion-main">

        <header className="recepcion-header">
          <div>
            <h4>{seccionActiva}</h4>
            <p>Gym Assistant / Administración</p>
          </div>

          <div className="header-user">
            <i className="bi bi-person-circle"></i>
            <span>Recepcionista</span>
          </div>
        </header>

        {/* SECCIÓN INICIO */}
        {seccionActiva === 'Inicio' ? (

          <section className="dashboard-content">

            <div className="welcome-section">
              <div>
                <h2>¡Bienvenido a recepción!</h2>
                <p>
                  Administra los accesos y consulta la información
                  del gimnasio desde este panel.
                </p>
              </div>
              <i className="bi bi-buildings"></i>
            </div>

            <h5 className="section-title">Resumen del gimnasio</h5>

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-4">
                <div className="summary-card">
                  <div className="summary-icon icon-blue">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div>
                    <p>Personas dentro</p>
                    <h3>0</h3>
                    <small>Ocupación actual</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="summary-card">
                  <div className="summary-icon icon-green">
                    <i className="bi bi-door-open-fill"></i>
                  </div>
                  <div>
                    <p>Espacios disponibles</p>
                    <h3>30</h3>
                    <small>Capacidad máxima: 30</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="summary-card">
                  <div className="summary-icon icon-orange">
                    <i className="bi bi-clipboard-check-fill"></i>
                  </div>
                  <div>
                    <p>Ingresos de hoy</p>
                    <h3>0</h3>
                    <small>Movimientos registrados</small>
                  </div>
                </div>
              </div>

            </div>

            <h5 className="section-title">Accesos rápidos</h5>

            <div className="row g-3">

              {opciones.map((opcion) => (
                <div className="col-12 col-md-6" key={opcion.titulo}>
                  <button
                    className="quick-action"
                    onClick={() => setSeccionActiva(opcion.seccion)}
                  >
                    <div className={`quick-icon text-${opcion.color}`}>
                      <i className={`bi ${opcion.icono}`}></i>
                    </div>

                    <div className="quick-text">
                      <strong>{opcion.titulo}</strong>
                      <small>{opcion.descripcion}</small>
                    </div>

                    <i className="bi bi-chevron-right quick-arrow"></i>
                  </button>
                </div>
              ))}

            </div>

          </section>

          ) : seccionActiva === 'Registro de accesos' ? (

          /* SECCIÓN REGISTRO DE ACCESOS */
          <section className="dashboard-content">
            <RegistroAccesos />
          </section>

        ) : seccionActiva === 'Aforo actual' ? (

          /* SECCIÓN AFORO ACTUAL */
          <section className="dashboard-content">
            <AforoActual />
          </section>

        ) : seccionActiva === 'Historial de ingresos' ? (

          <section className="dashboard-content">
            <HistorialIngresos />
          </section>

        ) : seccionActiva === 'Horarios administrativos' ? (

          <section className="dashboard-content">
            <HorariosAdministrativos />
          </section>

        ) : seccionActiva === 'Gestión de personas' ? (

          <section className="dashboard-content">
            <GestionPersonas />
          </section>

        ) : (

          /* OTRAS SECCIONES */
          <section className="dashboard-content">
            <div className="placeholder-section">
              <i className="bi bi-cone-striped"></i>

              <h4>{seccionActiva}</h4>

              <p>
                Esta sección se desarrollará en la siguiente etapa
                del módulo de recepción.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => setSeccionActiva('Inicio')}
              >
                Volver al inicio
              </button>

            </div>
          </section>

        )}

      </main>
    </div>
  );
}

export default App;