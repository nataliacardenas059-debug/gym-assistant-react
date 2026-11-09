import { usuariosPrueba } from '../data/usuariosPrueba.js';

const CLAVE_USUARIOS = 'usuariosGym';

export function obtenerUsuarios() {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);
    if (!guardados) return usuariosPrueba;

    const lista = JSON.parse(guardados);
    if (!Array.isArray(lista)) return usuariosPrueba;

    // Completa los registros de prueba antiguos que aún no tenían correo/clave.
    const actualizados = lista.map((usuario) => {
      const semilla = usuariosPrueba.find((item) => item.id === usuario.id);
      return {
        ...usuario,
        correo_institucional: usuario.correo_institucional || semilla?.correo_institucional || '',
        password: usuario.password || semilla?.password || '',
      };
    });

    // Guarda la migración para que el inicio de sesión pueda usar los mismos datos.
    if (JSON.stringify(actualizados) !== JSON.stringify(lista)) {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
    }
    return actualizados;
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
  if (usuarios.some((usuario) => usuario.correo_institucional?.toLowerCase() === datos.correo_institucional.trim().toLowerCase())) {
    throw new Error('Ya existe una persona registrada con ese correo.');
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre_completo: datos.nombre_completo.trim(),
    correo_institucional: datos.correo_institucional.trim().toLowerCase(),
    password: datos.password,
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
  if (usuarios.some((usuario) =>
    usuario.correo_institucional?.toLowerCase() === datos.correo_institucional.trim().toLowerCase() &&
    usuario.id !== id
  )) {
    throw new Error('Otro usuario ya tiene registrado ese correo.');
  }

  const actualizados = usuarios.map((usuario) => {
    if (usuario.id !== id) return usuario;

    return {
      ...usuario,
      nombre_completo: datos.nombre_completo.trim(),
      correo_institucional: datos.correo_institucional.trim().toLowerCase(),
      password: datos.password?.trim() ? datos.password : usuario.password,
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
