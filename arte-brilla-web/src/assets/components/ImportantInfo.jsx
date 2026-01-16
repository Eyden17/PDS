import React from 'react';
import '../styles/ImportantInfo.css';

const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 3v4M17 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconShoe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 15c1-2 3-4 6-4h6c2 0 4 1 4 3v1c0 1-1 2-2 2H6c-2 0-3-1-3-2v-0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11c1-2 4-3 7-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const ImportantInfo = () => {
  const infoItems = [
    {
      id: 1,
      icon: <IconCalendar />,
      title: 'Horarios',
      description: 'Horarios por grupo y nivel, con opciones matutinas y vespertinas.'
    },
    {
      id: 2,
      icon: <IconCard />,
      title: 'Matrícula',
      description: 'Proceso claro, tarifas transparentes y opciones de pago.'
    },
    {
      id: 3,
      icon: <IconShoe />,
      title: 'Requerimientos',
      description: 'Material básico: zapatillas, ropa cómoda y ganas de aprender.'
    },
    {
      id: 4,
      icon: <IconPin />,
      title: 'Ubicación',
      description: 'Instalaciones céntricas, seguras y accesibles en transporte.'
    }
  ];

  return (
    <section className="important-info site-section">
      <div className="container">
        <div className="section-header">
          <h2>Información Importante</h2>
          <p className="muted">Aspectos clave para tu inscripción y asistencia</p>
        </div>

        <div className="info-grid">
          {infoItems.map(item => (
            <div key={item.id} className="info-card">
              <div className="info-icon" aria-hidden>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="info-banner subtle">
          <div className="banner-content">
            <h3>¿Listo para formar parte de Arte Brilla?</h3>
            <p>Solicita información detallada sobre horarios y tarifas con nuestro equipo.</p>
            <a href="/contact" className="btn btn-outline">Contactar</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantInfo;
