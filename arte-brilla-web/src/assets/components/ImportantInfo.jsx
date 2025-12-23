import React from 'react';
import '../styles/ImportantInfo.css';

const ImportantInfo = () => {
  const infoItems = [
    {
      id: 1,
      icon: '📅',
      title: 'Horarios',
      description: 'Consulta los horarios disponibles para cada grupo según tu edad y disponibilidad.'
    },
    {
      id: 2,
      icon: '💳',
      title: 'Matrícula e Inscripción',
      description: 'Proceso de inscripción simple. Requiere completar formulario y documentación.'
    },
    {
      id: 3,
      icon: '👟',
      title: 'Requerimientos',
      description: 'Zapatillas de danza, ropa cómoda y disposición para aprender y disfrutar.'
    },
    {
      id: 4,
      icon: '📍',
      title: 'Ubicación',
      description: 'Ubicados cerca del Hospital. Alianza con SINEM para eventos culturales.'
    }
  ];

  return (
    <section className="important-info">
      <div className="container">
        <div className="section-header">
          <h2>Información Importante</h2>
          <p>Lo que necesitas saber antes de inscribirte</p>
        </div>

        <div className="info-grid">
          {infoItems.map(item => (
            <div key={item.id} className="info-card">
              <div className="info-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="info-banner">
          <h3>¿Listo para comenzar tu viaje en la danza?</h3>
          <p>Contáctanos para más información sobre inscripción, horarios y requisitos.</p>
          <button className="cta-btn">Solicitar Información</button>
        </div>
      </div>
    </section>
  );
};

export default ImportantInfo;
