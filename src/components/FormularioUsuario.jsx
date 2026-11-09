import { useEffect, useState } from 'react';

const formularioVacio = {
  nombre_completo: '',
  correo_institucional: '',
  password: '',
  tipo_documento: 'CC',
  numero_documento: '',
  tipo_persona: 'estudiante',
  estado: 'activo',
  tipo_acceso: 'membresia',
  membresia_estado: 'activa',
  membresia_tipo: 'mensual',
  membresia_fecha_fin: '',
};

function FormularioUsuario({ usuario, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(formularioVacio);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario) {
      const esAdministrativo = usuario.tipo_persona === 'administrativo' || usuario.rol === 'administrativo';
      setDatos({
        ...formularioVacio,
        ...usuario,
        membresia_estado: esAdministrativo ? 'no_aplica' : (usuario.membresia_estado || 'sin_informacion'),
        membresia_tipo: usuario.membresia_tipo || 'mensual',
        membresia_fecha_fin: usuario.membresia_fecha_fin || '',
        correo_institucional: usuario.correo_institucional || '',
        password: '',
      });
    } else {
      setDatos(formularioVacio);
    }
    setError('');
  }, [usuario]);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setDatos((anterior) => {
      const nuevos = { ...anterior, [name]: value };
      if (name === 'tipo_persona' && value === 'administrativo') {
        nuevos.membresia_estado = 'no_aplica';
        nuevos.tipo_acceso = 'administrativo';
      } else if (name === 'tipo_persona' && anterior.tipo_persona === 'administrativo') {
        nuevos.membresia_estado = 'activa';
        nuevos.tipo_acceso = 'membresia';
      }
      return nuevos;
    });
  };

  const enviar = (evento) => {
    evento.preventDefault();
    setError('');

    if (!datos.nombre_completo.trim() || !datos.numero_documento.trim() || !datos.correo_institucional.trim()) {
      setError('Completa el nombre, el correo institucional y el número de documento.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo_institucional.trim())) {
      setError('Ingresa un correo institucional válido.');
      return;
    }

    if (!usuario && datos.password.trim().length < 4) {
      setError('La contraseña inicial debe tener al menos 4 caracteres.');
      return;
    }

    if (!/^\d{5,15}$/.test(datos.numero_documento.trim())) {
      setError('El documento debe contener entre 5 y 15 números.');
      return;
    }

    onGuardar(datos);
  };

  const esAdministrativo = datos.tipo_persona === 'administrativo';
  const membresiaNoAplica = esAdministrativo || datos.membresia_estado === 'no_aplica';

  return (
    <form onSubmit={enviar}>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="nombre_completo">Nombre completo</label>
          <input id="nombre_completo" name="nombre_completo" className="form-control" value={datos.nombre_completo} onChange={cambiar} placeholder="Ej. María Gómez" maxLength="100" required />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="correo_institucional">Correo institucional</label>
          <input id="correo_institucional" name="correo_institucional" type="email" className="form-control" value={datos.correo_institucional} onChange={cambiar} placeholder="usuario@pascualbravo.edu.co" required />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="password">{usuario ? 'Nueva contraseña (opcional)' : 'Contraseña inicial'}</label>
          <input id="password" name="password" type="password" className="form-control" value={datos.password} onChange={cambiar} placeholder={usuario ? 'Dejar vacío para conservar la actual' : 'Mínimo 4 caracteres'} minLength="4" required={!usuario} />
          {usuario && <div className="form-text">Si no deseas cambiarla, deja este campo vacío.</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="tipo_documento">Tipo de documento</label>
          <select id="tipo_documento" name="tipo_documento" className="form-select" value={datos.tipo_documento} onChange={cambiar}>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PP">Pasaporte</option>
          </select>
        </div>

        <div className="col-md-8">
          <label className="form-label" htmlFor="numero_documento">Número de documento</label>
          <input id="numero_documento" name="numero_documento" className="form-control" value={datos.numero_documento} onChange={cambiar} inputMode="numeric" placeholder="Solo números" maxLength="15" required />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="tipo_persona">Clasificación</label>
          <select id="tipo_persona" name="tipo_persona" className="form-select" value={datos.tipo_persona} onChange={cambiar}>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="estado">Estado del usuario</label>
          <select id="estado" name="estado" className="form-select" value={datos.estado} onChange={cambiar}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="col-12"><hr className="my-1" /><h6 className="mb-0">Información de membresía</h6></div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="membresia_estado">Estado de membresía</label>
          <select id="membresia_estado" name="membresia_estado" className="form-select" value={esAdministrativo ? 'no_aplica' : datos.membresia_estado} onChange={cambiar} disabled={esAdministrativo}>
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
            <option value="sin_informacion">Sin información</option>
            <option value="no_aplica">No aplica</option>
          </select>
          {esAdministrativo && <div className="form-text">Para administrativos no se registra membresía.</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="membresia_tipo">Tipo de membresía</label>
          <select id="membresia_tipo" name="membresia_tipo" className="form-select" value={datos.membresia_tipo} onChange={cambiar} disabled={membresiaNoAplica}>
            <option value="diaria">Diaria</option>
            <option value="mensual">Mensual</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label" htmlFor="membresia_fecha_fin">Fecha de vencimiento</label>
          <input id="membresia_fecha_fin" name="membresia_fecha_fin" type="date" className="form-control" value={datos.membresia_fecha_fin} onChange={cambiar} disabled={membresiaNoAplica} />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary"><i className="bi bi-check2-circle me-2"></i>{usuario ? 'Guardar cambios' : 'Registrar persona'}</button>
      </div>
    </form>
  );
}

export default FormularioUsuario;
