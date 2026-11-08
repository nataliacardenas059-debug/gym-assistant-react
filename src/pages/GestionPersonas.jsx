import { useMemo, useState } from 'react';
import FormularioUsuario from '../components/FormularioUsuario';
import { actualizarUsuario, cambiarEstadoUsuario, crearUsuario, obtenerUsuarios } from '../services/usuariosService';

const etiquetasMembresia = {
  activa: { texto: 'Activa', clase: 'success' },
  inactiva: { texto: 'Inactiva', clase: 'danger' },
  sin_informacion: { texto: 'Sin información', clase: 'secondary' },
  vencida: { texto: 'Vencida', clase: 'warning' },
  no_aplica: { texto: 'No aplica', clase: 'secondary' },
};

function GestionPersonas() {
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');

  const usuariosFiltrados = useMemo(() => usuarios.filter((usuario) => {
    const termino = busqueda.trim().toLowerCase();
    const coincideTexto = !termino ||
      usuario.nombre_completo?.toLowerCase().includes(termino) ||
      usuario.numero_documento?.toLowerCase().includes(termino);
    const coincideTipo = filtroTipo === 'todos' || usuario.tipo_persona === filtroTipo || usuario.rol === filtroTipo;
    const coincideEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado;
    return coincideTexto && coincideTipo && coincideEstado;
  }), [usuarios, busqueda, filtroTipo, filtroEstado]);

  const mostrarAviso = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const abrirNuevo = () => {
    setUsuarioEditar(null);
    setMostrarFormulario(true);
    setMensaje('');
  };

  const abrirEdicion = (usuario) => {
    setUsuarioEditar(usuario);
    setMostrarFormulario(true);
    setMensaje('');
  };

  const guardar = (datos) => {
    try {
      if (usuarioEditar) {
        const actualizados = actualizarUsuario(usuarioEditar.id, datos);
        setUsuarios(actualizados);
        mostrarAviso('La información de la persona se actualizó correctamente.');
      } else {
        const nuevo = crearUsuario(datos);
        setUsuarios((actuales) => [...actuales, nuevo]);
        mostrarAviso('La persona se registró correctamente.');
      }
      setMostrarFormulario(false);
      setUsuarioEditar(null);
    } catch (error) {
      mostrarAviso(error.message || 'No fue posible guardar la información.', 'danger');
    }
  };

  const cambiarEstado = (usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'inactivo' ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Deseas ${accion} a ${usuario.nombre_completo}?`)) return;
    const actualizados = cambiarEstadoUsuario(usuario.id, nuevoEstado);
    setUsuarios(actualizados);
    mostrarAviso(`La persona quedó ${nuevoEstado === 'activo' ? 'activa' : 'inactiva'}.`);
  };

  const contar = (condicion) => usuarios.filter(condicion).length;

  const membresiaDe = (usuario) => {
    if (usuario.tipo_persona === 'administrativo' || usuario.rol === 'administrativo') return etiquetasMembresia.no_aplica;
    if (usuario.membresia_estado === 'activa' && usuario.membresia_fecha_fin) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const vencimiento = new Date(`${usuario.membresia_fecha_fin}T00:00:00`);
      if (!Number.isNaN(vencimiento.getTime()) && vencimiento < hoy) return etiquetasMembresia.vencida;
    }
    return etiquetasMembresia[usuario.membresia_estado] || etiquetasMembresia.sin_informacion;
  };

  return (
    <div className="gestion-personas-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="mb-1">Gestión de personas</h5>
          <p className="text-muted mb-0">Registra, consulta y administra los usuarios del gimnasio.</p>
        </div>
        {!mostrarFormulario && <button className="btn btn-primary" onClick={abrirNuevo}><i className="bi bi-person-plus me-2"></i>Registrar persona</button>}
      </div>

      {mensaje && <div className={`alert alert-${tipoMensaje} alert-dismissible fade show`} role="alert">{mensaje}<button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMensaje('')}></button></div>}

      {mostrarFormulario ? (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3"><h6 className="mb-0">{usuarioEditar ? 'Editar información de la persona' : 'Registrar nueva persona'}</h6></div>
          <div className="card-body p-3 p-md-4"><FormularioUsuario usuario={usuarioEditar} onGuardar={guardar} onCancelar={() => { setMostrarFormulario(false); setUsuarioEditar(null); }} /></div>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted small">Total registrados</div><div className="fs-3 fw-semibold">{usuarios.length}</div></div></div></div>
            <div className="col-12 col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted small">Usuarios activos</div><div className="fs-3 fw-semibold text-success">{contar((u) => u.estado === 'activo')}</div></div></div></div>
            <div className="col-12 col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted small">Estudiantes</div><div className="fs-3 fw-semibold">{contar((u) => u.tipo_persona === 'estudiante' || u.rol === 'estudiante')}</div></div></div></div>
            <div className="col-12 col-sm-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-muted small">Profesores y administrativos</div><div className="fs-3 fw-semibold">{contar((u) => ['profesor', 'administrativo'].includes(u.tipo_persona || u.rol))}</div></div></div></div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-2 mb-3">
                <div className="col-12 col-lg-6"><div className="input-group"><span className="input-group-text bg-white"><i className="bi bi-search"></i></span><input className="form-control" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o documento" /></div></div>
                <div className="col-6 col-lg-3"><select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} aria-label="Filtrar por clasificación"><option value="todos">Todas las clasificaciones</option><option value="estudiante">Estudiantes</option><option value="profesor">Profesores</option><option value="administrativo">Administrativos</option></select></div>
                <div className="col-6 col-lg-3"><select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} aria-label="Filtrar por estado"><option value="todos">Todos los estados</option><option value="activo">Activos</option><option value="inactivo">Inactivos</option></select></div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2"><h6 className="mb-0">Usuarios registrados</h6><span className="small text-muted">{usuariosFiltrados.length} resultado(s)</span></div>

              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-5"><i className="bi bi-people fs-1 text-secondary"></i><p className="fw-semibold mt-2 mb-1">No se encontraron personas</p><p className="text-muted small mb-0">Prueba con otro nombre, documento o filtro.</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>Persona</th><th>Documento</th><th>Clasificación</th><th>Estado</th><th>Membresía</th><th className="text-end">Acciones</th></tr></thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => {
                        const membresia = membresiaDe(usuario);
                        return <tr key={usuario.id}>
                          <td><div className="fw-semibold">{usuario.nombre_completo}</div><small className="text-muted">ID: {usuario.id}</small></td>
                          <td>{usuario.tipo_documento || 'CC'} {usuario.numero_documento}</td>
                          <td><span className="text-capitalize">{usuario.tipo_persona || usuario.rol || 'Sin clasificar'}</span></td>
                          <td><span className={`badge text-bg-${usuario.estado === 'activo' ? 'success' : 'secondary'}`}>{usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                          <td><span className={`badge text-bg-${membresia.clase}`}>{membresia.texto}</span>{usuario.membresia_fecha_fin && <div className="small text-muted mt-1">Hasta: {usuario.membresia_fecha_fin}</div>}</td>
                          <td><div className="d-flex justify-content-end gap-1"><button className="btn btn-sm btn-outline-primary" title="Editar" aria-label={`Editar ${usuario.nombre_completo}`} onClick={() => abrirEdicion(usuario)}><i className="bi bi-pencil-square"></i></button><button className={`btn btn-sm ${usuario.estado === 'activo' ? 'btn-outline-danger' : 'btn-outline-success'}`} title={usuario.estado === 'activo' ? 'Desactivar' : 'Activar'} aria-label={`${usuario.estado === 'activo' ? 'Desactivar' : 'Activar'} ${usuario.nombre_completo}`} onClick={() => cambiarEstado(usuario)}><i className={`bi ${usuario.estado === 'activo' ? 'bi-person-dash' : 'bi-person-check'}`}></i></button></div></td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <p className="text-muted small mt-3 mb-0"><i className="bi bi-info-circle me-1"></i>Los cambios se guardan en el almacenamiento local del navegador. La conexión con el backend se realizará en una etapa posterior.</p>
        </>
      )}
    </div>
  );
}

export default GestionPersonas;
