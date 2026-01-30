import React, { useEffect, useState } from 'react';
import { classesData } from '../../data/classesData';
import { classService } from '../../services/classService';
import '../styles/Classes.css';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService.listPublic()
      .then(data => setClasses(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [selectedArea, setSelectedArea] = useState(null);

  const areas = [
    { id: 'Babies', label: 'Arte Brilla Babys', color: '#ec4899', icon: '👶', description: '3-5 años' },
    { id: 'Baby Shine', label: 'Baby Shine', color: '#22d3ee', icon: '🌟', description: '4-6 años' },
    { id: 'Minies', label: 'Arte Brilla Minis', color: '#8b5cf6', icon: '🎀', description: '6+ años' },
    { id: 'Arte Profética', label: 'Arte Profética Brilla', color: '#f4a460', icon: '✨', description: 'Todas las edades' }
  ];

  const getClassesByArea = (areaId) => {
    return classes.filter(clase => clase.group_name === areaId);
  };

  return (
    <div className="classes-page">
      {/* Hero Section */}
      <section className="classes-hero">
        <div className="classes-hero-content">
          <h1>Nuestras Clases</h1>
          <p>Descubre la danza que te apasiona</p>
        </div>
      </section>

      {/* Areas Showcase */}
      <section className="classes-areas-showcase">
        <div className="showcase-container">
          {areas.map(area => (
            <div
              key={area.id}
              className={`area-card ${selectedArea === area.id ? 'active' : ''}`}
              onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              style={{ borderColor: area.color }}
            >
              <div className="area-icon">{area.icon}</div>
              <h3 className="area-title">{area.label}</h3>
              <p className="area-description">{area.description}</p>
              <button 
                className="area-btn"
                style={{ backgroundColor: area.color }}
              >
                {selectedArea === area.id ? 'Ver menos' : 'Ver clases'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Area Classes */}
      {selectedArea && (
        <section className="classes-section">
          <div className="section-header">
            <h2>
              {areas.find(a => a.id === selectedArea)?.icon} 
              {' '} Clases de {selectedArea}
            </h2>
            <button 
              className="close-section"
              onClick={() => setSelectedArea(null)}
            >
              ✕
            </button>
          </div>

          {getClassesByArea(selectedArea).length === 0 ? (
            <div className="classes-empty">
              <p className="empty-emoji">⏳</p>
              <h3>Pronto publicaremos los horarios de este equipo</h3>
              <p>Estamos ajustando la oferta. Escríbenos para más detalles o reserva tu interés.</p>
              <button className="class-action-btn" style={{ backgroundColor: '#6b7280' }} onClick={() => { window.location.href = '/contact'; }}>Contactar</button>
            </div>
          ) : (
            <div className="classes-list">
              {getClassesByArea(selectedArea).map(clase => (
                <div key={clase.id} className="class-item">
                  <div className="class-left">
                    <div 
                      className="class-color-bar"
                      style={{ backgroundColor: clase.color }}
                    ></div>
                    <div className="class-content">
                      <h4>{clase.name}</h4>
                      <p className="class-instructor">👨‍🏫 {clase.instructor}</p>
                      <p className="class-level">📚 {clase.level}</p>
                    </div>
                  </div>

                  <div className="class-details">
                    <span className="detail-item">
                      <strong>📅</strong> {clase.schedule}
                    </span>
                    <span className="detail-item">
                      <strong>⏰</strong> {clase.time}
                    </span>
                    <span className="detail-item">
                      <strong>👥</strong> {clase.capacity}
                    </span>
                  </div>

                  <p className="class-description">{clase.description}</p>

                  <button 
                    className="class-action-btn"
                    style={{ backgroundColor: clase.color }}
                  >
                    Inscribirse
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Empty State */}
      {!selectedArea && (
        <section className="classes-empty-state">
          <div className="empty-content">
            <p className="empty-emoji">🎭</p>
            <h3>Selecciona un área para ver las clases disponibles</h3>
            <p>Haz clic en cualquiera de las tarjetas superiores para explorar</p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="classes-cta">
        <div className="cta-wrapper">
          <h2>¿Tienes dudas sobre nuestras clases?</h2>
          <p>Contáctanos para más información o solicita una clase de prueba</p>
          <button
            className="cta-button"
            onClick={() => { window.location.href = '/contact'; }}
          >
            Contactar Ahora
          </button>
        </div>
      </section>
    </div>
  );
}

export default Classes;
