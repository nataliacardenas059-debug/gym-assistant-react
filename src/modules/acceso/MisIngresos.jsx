import { useEffect, useState } from 'react';
import { obtenerHistorial } from './authService';

const formatearFechaHora = (fecha) => {
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime())
    ? 'Fecha no disponible'
    : valor.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function MisIngresos({ usuarioId, recargar }) {
  const [registros, setRegistros] = useState(null);

  useEffect(() => {
    let activo = true;
    obtenerHistorial(usuarioId).then((datos) => {
      if (activo) setRegistros(datos);
    });
    return () => { activo = false; };
  }, [usuarioId, recargar]);

  if (!registros) return <div className="acc-card">Cargando historial...</div>;
  if (!registros.length) return <div className="acc-card">Aún no tienes movimientos registrados.</div>;

  return (
    <div className="acc-tabla-wrap">
      <table className="acc-tabla">
        <thead>
          <tr>
            <th>Movimiento</th>
            <th>Fecha y hora</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.tipo === 'entrada' ? 'Entrada' : 'Salida'}</td>
              <td>{formatearFechaHora(registro.fecha)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
