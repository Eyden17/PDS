import React from 'react';
import '../styles/DanceAreas.css';

const DanceAreas = () => {
  const areas = [
    {
      id: 1,
      title: 'Babies',
      ageRange: '3 a 5 años',
      description: 'Iniciación en danza para los más pequeños. Desarrollo de coordinación, ritmo y expresión a través del movimiento.',
      icon: '👶',
      color: 'pink'
    },
    {
      id: 2,
      title: 'Minies',
      ageRange: '6 años en adelante',
      description: 'Formación integral en danza. Técnicas de baile, ritmo y expresión artística con metodología profesional.',
      icon: '🎀',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Artes Proféticas',
      ageRange: 'Todos los niveles',
      description: 'Artes cristianas que fusionan danza, expresión y espiritualidad. Movimiento con propósito y mensaje.',
      icon: '✨',
      color: 'gold'
    }
  ];

  return (
    <section className="dance-areas">
      <div className="container">
        <div className="section-header">
          <h2>Nuestras Áreas de Formación</h2>
          <p>Clases diseñadas para cada edad y nivel de experiencia</p>
        </div>

        <div className="areas-grid">
          {areas.map(area => (
            <div key={area.id} className={`area-card area-${area.color}`}>
              <div className="area-icon">{area.icon}</div>
              <h3>{area.title}</h3>
              <p className="age-range">{area.ageRange}</p>
              <p className="description">{area.description}</p>
              <button className="area-btn">Más información</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DanceAreas;
