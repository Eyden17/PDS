import React from 'react';
import '../styles/Mission.css';

const Mission = () => {
  return (
    <section className="mission-section">
      <div className="container">
        <div className="mission-content">
          <div className="mission-text">
            <h2>Nuestra Misión</h2>
            <p>
              Formar bailarines íntegros mediante una educación profesional y afectiva, promoviendo técnica, creatividad y valores en un entorno seguro y respetuoso.
            </p>
          </div>

          <div className="mission-highlights">
            <div className="highlight-item">
              <div className="highlight-icon">🎭</div>
              <h3>Formación Integral</h3>
              <p>Desarrollo técnico y expresivo</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">✓</div>
              <h3>Calidad y Reconocimiento</h3>
              <p>Programas avalados y docentes certificados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
