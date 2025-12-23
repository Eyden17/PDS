import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Fondo con imagen */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?q=80&w=2070&auto=format&fit=crop" 
          alt="Estudiantes de danza en clase"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Contenido principal */}
      <div className="hero-content">
        {/* Badge */}
        <div className="badge">
          <span className="badge-icon">🎭</span>
          <span>Inscripciones Abiertas 2025</span>
        </div>

        {/* Título principal */}
        <h1 className="main-title">
          Donde tu talento<br />
          <span className="highlight">brilla</span>
        </h1>

        {/* Subtítulo */}
        <p className="subtitle">
          Formación integral en danza. Clases para Babies, Minies y Artes Proféticas.<br />
          Instructores certificados, metodología profesional, reconocimiento oficial.
        </p>

        {/* Botones CTA */}
        <div className="cta-buttons">
          <button className="btn btn-primary">
            Explorar Clases
          </button>
          <button className="btn btn-secondary">
            Contactar
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Estudiantes</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">15+</div>
            <div className="stat-label">Años</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">20+</div>
            <div className="stat-label">Eventos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;