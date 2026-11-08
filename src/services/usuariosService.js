import { usuariosPrueba } from '../data/usuariosPrueba';

const CLAVE_USUARIOS = 'usuariosGym';

export function obtenerUsuarios() {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);
    return guardados ? JSON.parse(guardados) : usuariosPrueba;
  } catch (error) {
    console.error('No fue posible leer los usuarios guardados:', error);
    return usuariosPrueba;
  }
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

export function crearUsuario(datos) {
  const usuarios = obtenerUsuarios();
  const documentoExiste = usuarios.some(
    (usuario) => usuario.numero_documento === datos.numero_documento.trim()
  );

  if (documentoExiste) {
    throw new Error('Ya existe una persona registrada con ese documento.');
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre_completo: datos.nombre_completo.trim(),
    numero_documento: datos.numero_documento.trim(),
    tipo_documento: datos.tipo_documento,
    tipo_persona: datos.tipo_persona,
    rol: datos.tipo_persona,
    estado: datos.estado,
    sesion_activa: 0,
    tipo_acceso: datos.tipo_persona === 'administrativo' ? 'administrativo' : datos.tipo_acceso,
    membresia_estado: datos.tipo_persona === 'administrativo' ? 'no_aplica' : datos.membresia_estado,
    membresia_tipo: datos.membresia_tipo,
    membresia_fecha_fin: datos.membresia_fecha_fin || '',
    ultima_asistencia: null,
    ultima_actividad: null,
  };

  guardarUsuarios([...usuarios, nuevoUsuario]);
  return nuevoUsuario;
}

export function actualizarUsuario(id, datos) {
  const usuarios = obtenerUsuarios();
  const documentoExiste = usuarios.some(
    (usuario) =>
      usuario.numero_documento === datos.numero_documento.trim() &&
      usuario.id !== id
  );

  if (documentoExiste) {
    throw new Error('Otro usuario ya tiene registrado ese documento.');
  }

  const actualizados = usuarios.map((usuario) => {
    if (usuario.id !== id) return usuario;

    return {
      ...usuario,
      nombre_completo: datos.nombre_completo.trim(),
      numero_documento: datos.numero_documento.trim(),
      tipo_documento: datos.tipo_documento,
      tipo_persona: datos.tipo_persona,
      rol: datos.tipo_persona,
      estado: datos.estado,
      tipo_acceso: datos.tipo_persona === 'administrativo' ? 'administrativo' : datos.tipo_acceso,
      membresia_estado: datos.tipo_persona === 'administrativo' ? 'no_aplica' : datos.membresia_estado,
      membresia_tipo: datos.membresia_tipo,
      membresia_fecha_fin: datos.membresia_fecha_fin || '',
      sesion_activa: datos.estado === 'activo' ? usuario.sesion_activa : 0,
    };
  });

  guardarUsuarios(actualizados);
  return actualizados;
}

export function cambiarEstadoUsuario(id, estado) {
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.map((usuario) =>
    usuario.id === id
      ? { ...usuario, estado, sesion_activa: estado === 'activo' ? usuario.sesion_activa : 0 }
      : usuario
  );

  guardarUsuarios(actualizados);
  return actualizados;
}
