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
              En Arte Brilla, nos dedicamos a formar integralmente a nuestros estudiantes a través de la danza como medio de expresión artística y personal. Buscamos desarrollar talento, confianza y amor por el arte en cada uno de nuestros alumnos, trabajando en colaboración con la comunidad y bajo estándares de calidad profesional.
            </p>
            <p>
              Con alianza del SINEM (Sistema Nacional de Educación Musical), garantizamos un reconocimiento oficial de nuestras actividades y nos mantenemos versátiles para participar en eventos culturales significativos.
            </p>
          </div>

          <div className="mission-highlights">
            <div className="highlight-item">
              <div className="highlight-icon">🎭</div>
              <h3>Formación Integral</h3>
              <p>Desarrollo artístico, físico y emocional</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">🤝</div>
              <h3>Comunidad</h3>
              <p>Trabajo colaborativo con la sociedad</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">✓</div>
              <h3>Calidad</h3>
              <p>Reconocimiento oficial SINEM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
