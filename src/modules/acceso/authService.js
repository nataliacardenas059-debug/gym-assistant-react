import { obtenerUsuarios, guardarUsuarios } from '../../services/usuariosService.js';

export const USAR_SIMULADO = true;
const CORREO_RECEPCION = 'admin@gymassistant.com';
const CLAVE_RECEPCION = '123456';
const esperar = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function obtenerHistorialCompleto() {
  try {
    const datos = JSON.parse(localStorage.getItem('historialAccesos') || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

/* ---------- INICIO DE SESIÓN ---------- */
export async function iniciarSesion(correo, password) {
  const correoNormalizado = correo?.trim().toLowerCase();
  if (!correoNormalizado) throw new Error('Ingresa tu correo institucional.');

  await esperar();

  // Cuenta de demostración para el personal de recepción.
  if (correoNormalizado === CORREO_RECEPCION) {
    if (!password) throw new Error('Ingresa tu contraseña.');
    if (password !== CLAVE_RECEPCION) throw new Error('Contraseña incorrecta.');
    return {
      usuario: {
        id: 0,
        nombre: 'Recepción GymAssistant',
        correo: CORREO_RECEPCION,
        rol: 'admin',
        tipoPersona: 'recepcionista',
      },
    };
  }

  const persona = obtenerUsuarios().find(
    (item) => item.correo_institucional?.trim().toLowerCase() === correoNormalizado
  );

  if (!persona) throw new Error('No existe una persona registrada con ese correo.');
  if (persona.estado !== 'activo') throw new Error('Tu usuario se encuentra inactivo.');
  if (!persona.password) return { primerIngreso: true, id: persona.id };
  if (!password) throw new Error('Ingresa tu contraseña.');
  if (persona.password !== password) throw new Error('Contraseña incorrecta.');

  return {
    usuario: {
      id: persona.id,
      nombre: persona.nombre_completo,
      correo: persona.correo_institucional,
      rol: 'usuario',
      tipoPersona: persona.tipo_persona || persona.rol || 'usuario',
      numeroDocumento: persona.numero_documento,
    },
  };
}

export async function crearPassword(id, password) {
  if (!password || password.length < 4) {
    throw new Error('La contraseña debe tener al menos 4 caracteres.');
  }
  await esperar();
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.map((persona) =>
    persona.id === id ? { ...persona, password } : persona
  );
  if (!actualizados.some((persona) => persona.id === id)) {
    throw new Error('No se encontró el usuario.');
  }
  guardarUsuarios(actualizados);
  return true;
}

/* ---------- INFORMACIÓN COMPARTIDA CON LOS OTROS MÓDULOS ---------- */
export async function obtenerMembresia(id) {
  await esperar(150);
  const persona = obtenerUsuarios().find((item) => item.id === id);
  if (!persona) return { mensaje: 'No se encontró la información de la persona.' };
  if (persona.tipo_persona === 'administrativo' || persona.rol === 'administrativo') {
    return { mensaje: 'Tu tipo de acceso es administrativo; no requiere membresía.' };
  }

  const tipo = persona.tipo_acceso === 'beneficio'
    ? 'beneficio'
    : (persona.membresia_tipo || 'Sin información');
  return {
    tipo,
    estado: persona.membresia_estado || 'Sin información',
    fecha_inicio: persona.ultima_asistencia || null,
    fecha_fin: persona.membresia_fecha_fin || null,
  };
}

export async function obtenerAforo() {
  await esperar(100);
  const total = obtenerUsuarios().filter(
    (persona) => Number(persona.sesion_activa) === 1
  ).length;
  return { total, capacidad: 30 };
}

export async function obtenerHistorial(id) {
  await esperar(100);
  return obtenerHistorialCompleto()
    .filter((movimiento) => String(movimiento.usuario_id) === String(id))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

export async function registrarSalida(usuario) {
  await esperar(150);
  const usuarios = obtenerUsuarios();
  const persona = usuarios.find((item) => String(item.id) === String(usuario.id));

  if (!persona) return { mensaje: 'No se encontró el usuario.' };
  if (Number(persona.sesion_activa) !== 1) {
    return { mensaje: 'No tienes una entrada activa registrada.' };
  }

  const fechaActual = new Date().toISOString();
  const actualizados = usuarios.map((item) =>
    String(item.id) === String(usuario.id)
      ? { ...item, sesion_activa: 0, ultima_actividad: fechaActual }
      : item
  );
  guardarUsuarios(actualizados);

  const historial = obtenerHistorialCompleto();
  historial.push({
    id: Date.now(),
    usuario_id: persona.id,
    nombre_completo: persona.nombre_completo,
    numero_documento: persona.numero_documento,
    tipo: 'salida',
    fecha: fechaActual,
  });
  localStorage.setItem('historialAccesos', JSON.stringify(historial));

  return { mensaje: 'Salida registrada correctamente.' };
}
