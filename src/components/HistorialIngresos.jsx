import { useState } from 'react';

function HistorialIngresos() {
  // Recuperar los movimientos guardados
  const [historial] = useState(() => {
    const guardados = localStorage.getItem('historialAccesos');

    return guardados ? JSON.parse(guardados) : [];
  });

  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtrar por tipo de movimiento y por nombre o documento
  const movimientosFiltrados = historial
    .filter((movimiento) => {
      if (filtro === 'todos') return true;

      return movimiento.tipo === filtro;
    })
    .filter((movimiento) => {
      const termino = busqueda.toLowerCase();

      return (
        movimiento.nombre_completo?.toLowerCase().includes(termino) ||
        movimiento.numero_documento?.toLowerCase().includes(termino)
      );
    })
    .sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

  // Dar formato a la fecha y hora
  const formatearFecha = (fecha) => {
    const fechaMovimiento = new Date(fecha);

    if (Number.isNaN(fechaMovimiento.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaMovimiento.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const cantidadEntradas = historial.filter(
    (movimiento) => movimiento.tipo === 'entrada'
  ).length;

  const cantidadSalidas = historial.filter(
    (movimiento) => movimiento.tipo === 'salida'
  ).length;

  return (
    <div className="historial-container">

      <div className="historial-intro">
        <h5>Historial de ingresos</h5>
        <p>
          Consulta los movimientos de entrada y salida registrados
          en el gimnasio.
        </p>
      </div>

      {/* Resumen de movimientos */}
      <div className="row g-3 mb-4">

        <div className="col-12 col-md-4">
          <div className="summary-card">
            <div className="summary-icon icon-blue">
              <i className="bi bi-list-ul"></i>
            </div>
            <div>
              <p>Total de movimientos</p>
              <h3>{historial.length}</h3>
              <small>Registros almacenados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="summary-card">
            <div className="summary-icon icon-green">
              <i className="bi bi-box-arrow-in-right"></i>
            </div>
            <div>
              <p>Entradas</p>
              <h3>{cantidadEntradas}</h3>
              <small>Ingresos registrados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="summary-card">
            <div className="summary-icon icon-orange">
              <i className="bi bi-box-arrow-right"></i>
            </div>
            <div>
              <p>Salidas</p>
              <h3>{cantidadSalidas}</h3>
              <small>Salidas registradas</small>
            </div>
          </div>
        </div>

      </div>

      {/* Tabla del historial */}
      <div className="historial-card">

        <div className="historial-filtros">

          <div>
            <h6>Movimientos registrados</h6>
            <small className="text-muted">
              {movimientosFiltrados.length} resultado(s)
            </small>
          </div>

          <div className="historial-controles">

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o documento"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos los movimientos</option>
              <option value="entrada">Solo entradas</option>
              <option value="salida">Solo salidas</option>
            </select>

          </div>

        </div>

        {movimientosFiltrados.length === 0 ? (

          <div className="historial-vacio">
            <i className="bi bi-inbox"></i>

            <h6>No hay movimientos para mostrar</h6>

            <p>
              {historial.length === 0
                ? 'Cuando registres entradas o salidas, aparecerán aquí.'
                : 'Intenta cambiar los filtros o el término de búsqueda.'}
            </p>
          </div>

        ) : (

          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Documento</th>
                  <th>Movimiento</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>

              <tbody>
                {movimientosFiltrados.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td className="fw-semibold">
                      {movimiento.nombre_completo}
                    </td>

                    <td>{movimiento.numero_documento}</td>

                    <td>
                      {movimiento.tipo === 'entrada' ? (
                        <span className="badge bg-success">
                          <i className="bi bi-box-arrow-in-right me-1"></i>
                          Entrada
                        </span>
                      ) : (
                        <span className="badge bg-primary">
                          <i className="bi bi-box-arrow-right me-1"></i>
                          Salida
                        </span>
                      )}
                    </td>

                    <td>{formatearFecha(movimiento.fecha)}</td>
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

export default HistorialIngresos;