import { useEffect, useState } from 'react';
import { obtenerAforo } from './authService';

export default function MiAforo() {
  const [aforo, setAforo] = useState(null);

  useEffect(() => {
    let activo = true;
    const cargar = () => obtenerAforo().then((datos) => {
      if (activo) setAforo(datos);
    });
    cargar();
    const intervalo = setInterval(cargar, 10000);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, []);

  return (
    <div className="acc-card">
      <h3>{aforo === null ? 'Cargando...' : `👥 ${aforo.total} personas actualmente`}</h3>
      {aforo && <p>Capacidad máxima: {aforo.capacidad} personas</p>}
    </div>
  );
}
