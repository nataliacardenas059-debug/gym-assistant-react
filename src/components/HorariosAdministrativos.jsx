function HorariosAdministrativos() {
  const horarios = [
    {
      id: 1,
      titulo: 'Primer horario',
      inicio: '12:00 p. m.',
      fin: '1:00 p. m.',
      icono: 'bi-sun',
    },
    {
      id: 2,
      titulo: 'Segundo horario',
      inicio: '5:00 p. m.',
      fin: '6:00 p. m.',
      icono: 'bi-moon-stars',
    },
  ];

  return (
    <div className="horarios-container">

      <div className="horarios-intro">
        <h5>Horarios administrativos</h5>
        <p>
          Consulta las franjas horarias especiales establecidas
          para el acceso del personal administrativo.
        </p>
      </div>

      <div className="horarios-aviso">
        <i className="bi bi-info-circle-fill"></i>
        <div>
          <strong>Información importante</strong>
          <p>
            El personal administrativo debe cumplir con los
            horarios especiales establecidos para el acceso.
          </p>
        </div>
      </div>

      <h6 className="horarios-subtitulo">
        Franjas horarias establecidas
      </h6>

      <div className="row g-3">

        {horarios.map((horario) => (
          <div className="col-12 col-md-6" key={horario.id}>
            <div className="horario-card">

              <div className="horario-icono">
                <i className={`bi ${horario.icono}`}></i>
              </div>

              <div>
                <small>{horario.titulo}</small>

                <h4>
                  {horario.inicio} - {horario.fin}
                </h4>

                <span className="badge bg-success">
                  Horario establecido
                </span>
              </div>

            </div>
          </div>
        ))}

      </div>

      <div className="horarios-nota">
        <i className="bi bi-shield-check"></i>
        <p>
          Estos horarios se utilizarán como referencia para
          validar los accesos del personal administrativo.
        </p>
      </div>

    </div>
  );
}

export default HorariosAdministrativos;