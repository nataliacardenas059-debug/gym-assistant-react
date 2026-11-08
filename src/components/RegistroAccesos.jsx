
import { useState } from 'react';
import { usuariosPrueba } from '../data/usuariosPrueba';

function RegistroAccesos() {

  // Cargar usuarios guardados o utilizar los datos de prueba
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('usuariosGym');

    return guardados
      ? JSON.parse(guardados)
      : usuariosPrueba;
  });

  const [documento, setDocumento] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info');

  // Identificar si el usuario pertenece al personal administrativo
  const esAdministrativo = (usuario) => {
    return (
      usuario.tipo_persona?.toLowerCase() === 'administrativo' ||
      usuario.rol?.toLowerCase() === 'administrativo'
    );
  };

  // Validar los horarios especiales
  const validarHorarioAdministrativo = (fecha) => {
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();

    const minutosActuales = hora * 60 + minutos;

    const primerHorarioInicio = 12 * 60;
    const primerHorarioFin = 13 * 60;

    const segundoHorarioInicio = 17 * 60;
    const segundoHorarioFin = 18 * 60;

    const dentroPrimerHorario =
      minutosActuales >= primerHorarioInicio &&
      minutosActuales < primerHorarioFin;

    const dentroSegundoHorario =
      minutosActuales >= segundoHorarioInicio &&
      minutosActuales < segundoHorarioFin;

    return dentroPrimerHorario || dentroSegundoHorario;
  };

  // Buscar usuario por documento
  const buscarUsuario = () => {
    setMensaje('');
    setUsuarioEncontrado(null);

    if (!documento.trim()) {
      setMensaje('Por favor, ingresa un número de documento.');
      setTipoMensaje('warning');
      return;
    }

    const usuario = usuarios.find(
      (persona) =>
        persona.numero_documento === documento.trim()
    );

    if (!usuario) {
      setMensaje('No se encontró ningún usuario con ese documento.');
      setTipoMensaje('danger');
      return;
    }

    setUsuarioEncontrado(usuario);
  };

  // Registrar entrada o salida
  const registrarAcceso = (tipo) => {
    if (!usuarioEncontrado) return;

    if (usuarioEncontrado.estado !== 'activo') {
      setMensaje('No se puede registrar el acceso: el usuario está inactivo.');
      setTipoMensaje('danger');
      return;
    }

    if (tipo === 'entrada' && usuarioEncontrado.sesion_activa === 1) {
      setMensaje('El usuario ya tiene una entrada registrada.');
      setTipoMensaje('warning');
      return;
    }

    if (tipo === 'salida' && usuarioEncontrado.sesion_activa === 0) {
      setMensaje('El usuario no tiene una entrada activa.');
      setTipoMensaje('warning');
      return;
    }

    const fechaActual = new Date();

    // Validación especial para el personal administrativo
    if (
      tipo === 'entrada' &&
      esAdministrativo(usuarioEncontrado) &&
      !validarHorarioAdministrativo(fechaActual)
    ) {
      setMensaje(
        'Acceso denegado. El personal administrativo solo puede ingresar de 12:00 p. m. a 1:00 p. m. o de 5:00 p. m. a 6:00 p. m.'
      );
      setTipoMensaje('danger');
      return;
    }

    const usuarioActualizado = {
      ...usuarioEncontrado,
      sesion_activa: tipo === 'entrada' ? 1 : 0,
      ultima_asistencia:
        tipo === 'entrada'
          ? fechaActual.toISOString().slice(0, 10)
          : usuarioEncontrado.ultima_asistencia,
      ultima_actividad: fechaActual.toISOString(),
    };

    // Actualizar la lista de usuarios
    const usuariosActualizados = usuarios.map((persona) =>
      persona.id === usuarioEncontrado.id
        ? usuarioActualizado
        : persona
    );

    setUsuarios(usuariosActualizados);

    // Guardar usuarios en LocalStorage
    localStorage.setItem(
      'usuariosGym',
      JSON.stringify(usuariosActualizados)
    );

    // Recuperar historial existente
    const movimientos = JSON.parse(
      localStorage.getItem('historialAccesos') || '[]'
    );

    // Agregar nuevo movimiento
    movimientos.push({
      id: Date.now(),
      usuario_id: usuarioEncontrado.id,
      nombre_completo: usuarioEncontrado.nombre_completo,
      numero_documento: usuarioEncontrado.numero_documento,
      tipo: tipo,
      fecha: fechaActual.toISOString(),
    });

    // Guardar historial
    localStorage.setItem(
      'historialAccesos',
      JSON.stringify(movimientos)
    );

    // Actualizar usuario mostrado
    setUsuarioEncontrado(usuarioActualizado);

    setMensaje(
      tipo === 'entrada'
        ? '¡Entrada registrada correctamente!'
        : '¡Salida registrada correctamente!'
    );

    setTipoMensaje('success');
  };

  return (
    <div className="registro-container">

      <div className="registro-intro">
        <h5>Control de acceso</h5>
        <p>
          Busca al usuario mediante su número de documento para
          registrar su entrada o salida del gimnasio.
        </p>
      </div>

      <div className="registro-card">

        <label htmlFor="documento" className="form-label">
          Número de documento
        </label>

        <div className="input-group mb-3">

          <input
            id="documento"
            type="text"
            className="form-control"
            placeholder="Ej. 1001234567"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') buscarUsuario();
            }}
          />

          <button
            className="btn btn-primary"
            onClick={buscarUsuario}
          >
            <i className="bi bi-search me-2"></i>
            Buscar usuario
          </button>

        </div>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`} role="alert">
            {mensaje}
          </div>
        )}

        {usuarioEncontrado && (
          <div className="usuario-resultado">

            <h6>Información del usuario</h6>

            <div className="usuario-datos">

              <p>
                <strong>Nombre:</strong>{' '}
                {usuarioEncontrado.nombre_completo}
              </p>

              <p>
                <strong>Documento:</strong>{' '}
                {usuarioEncontrado.tipo_documento} -{' '}
                {usuarioEncontrado.numero_documento}
              </p>

              <p>
                <strong>Tipo de persona:</strong>{' '}
                {usuarioEncontrado.tipo_persona}
              </p>

              <p>
                <strong>Tipo de acceso:</strong>{' '}
                {usuarioEncontrado.tipo_acceso}
              </p>

              <p>
                <strong>Estado:</strong>{' '}
                {usuarioEncontrado.estado}
              </p>

              <p>
                <strong>Sesión:</strong>{' '}
                {usuarioEncontrado.sesion_activa === 1
                  ? 'Dentro del gimnasio'
                  : 'Fuera del gimnasio'}
              </p>

            </div>

            <div className="registro-botones">

              <button
                className="btn btn-success"
                onClick={() => registrarAcceso('entrada')}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Registrar entrada
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={() => registrarAcceso('salida')}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Registrar salida
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default RegistroAccesos;


