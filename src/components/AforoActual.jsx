import { useState } from 'react';
import { usuariosPrueba } from '../data/usuariosPrueba';

function AforoActual() {
  const CAPACIDAD_MAXIMA = 30;

  // Recuperar los usuarios guardados en LocalStorage
  const [usuarios] = useState(() => {
    const guardados = localStorage.getItem('usuariosGym');

    return guardados
      ? JSON.parse(guardados)
      : usuariosPrueba;
  });

  // Identificar las personas que están dentro
  const personasDentro = usuarios.filter(
    (usuario) => Number(usuario.sesion_activa) === 1
  );

  const cantidadDentro = personasDentro.length;
  const espaciosDisponibles = Math.max(
    0,
    CAPACIDAD_MAXIMA - cantidadDentro
  );

  const porcentajeOcupacion = Math.min(
    100,
    (cantidadDentro / CAPACIDAD_MAXIMA) * 100
  );

  return (
    <div className="aforo-container">

      <div className="aforo-intro">
        <h5>Control de aforo</h5>
        <p>
          Consulta la ocupación actual del gimnasio y los usuarios
          que se encuentran dentro de las instalaciones.
        </p>
      </div>

      {/* Resumen del aforo */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-md-4">
          <div className="summary-card">
            <div className="summary-icon icon-blue">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <p>Personas dentro</p>
              <h3>{cantidadDentro}</h3>
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
              <h3>{espaciosDisponibles}</h3>
              <small>Espacios libres</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="summary-card">
            <div className="summary-icon icon-orange">
              <i className="bi bi-building"></i>
            </div>
            <div>
              <p>Capacidad máxima</p>
              <h3>{CAPACIDAD_MAXIMA}</h3>
              <small>Capacidad del gimnasio</small>
            </div>
          </div>
        </div>

      </div>

      {/* Indicador visual */}
      <div className="aforo-card mb-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Nivel de ocupación</h6>
          <strong>{porcentajeOcupacion.toFixed(1)}%</strong>
        </div>

        <div
          className="progress"
          role="progressbar"
          aria-label="Porcentaje de ocupación"
          aria-valuenow={porcentajeOcupacion}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ height: '14px' }}
        >
          <div
            className="progress-bar"
            style={{ width: `${porcentajeOcupacion}%` }}
          ></div>
        </div>

        <small className="text-muted d-block mt-2">
          {cantidadDentro} de {CAPACIDAD_MAXIMA} espacios ocupados.
        </small>

      </div>

      {/* Lista de personas dentro */}
      <div className="aforo-card">

        <h6 className="mb-3">Personas actualmente en el gimnasio</h6>

        {personasDentro.length === 0 ? (

          <div className="text-center py-4">
            <i className="bi bi-people display-5 text-secondary"></i>
            <p className="mt-2 mb-0">
              Actualmente no hay personas dentro del gimnasio.
            </p>
          </div>

        ) : (

          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>Documento</th>
                  <th>Tipo de persona</th>
                  <th>Estado de sesión</th>
                </tr>
              </thead>

              <tbody>
                {personasDentro.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre_completo}</td>
                    <td>
                      {usuario.tipo_documento} - {usuario.numero_documento}
                    </td>
                    <td>{usuario.tipo_persona}</td>
                    <td>
                      <span className="badge bg-success">
                        Dentro del gimnasio
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        )}

      </div>

    </div>
  );
}

export default AforoActual;
