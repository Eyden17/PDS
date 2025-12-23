import React from 'react';
import '../styles/About.css';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h2 className="about-title">Sobre Nosotros</h2>
          <div className="title-underline"></div>
          <p className="about-subtitle">
            Descubre la pasión y dedicación detrás de Arte Brilla
          </p>
        </div>

        {/* Main Content */}
        <div className="about-content">
          {/* Left Column - Text */}
          <div className="about-text">
            <h3 className="section-subheading">Nuestra Historia</h3>
            <p className="about-paragraph">
              Arte Brilla nace de la visión de crear un espacio donde la danza 
              es más que movimiento: es expresión, libertad y transformación. 
              Desde nuestros inicios, hemos trabajado apasionadamente para 
              desarrollar las habilidades artísticas de nuestros estudiantes.
            </p>
            <p className="about-paragraph">
              Con profesionales capacitados y un ambiente acogedor, nos 
              comprometemos a inspirar a cada uno de nuestros bailarines 
              a alcanzar su máximo potencial.
            </p>

            <h3 className="section-subheading">¿Por Qué Elegir Arte Brilla?</h3>
            <ul className="about-features">
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Instructores profesionales y experimentados</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Variedad de estilos de danza</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Ambiente inclusivo y motivador</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Presentaciones y eventos regulares</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Horarios flexibles para todas las edades</span>
              </li>
            </ul>
          </div>

          {/* Right Column - Stats/Info */}
          <div className="about-stats">
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Estudiantes Activos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">15+</div>
                <div className="stat-label">Años de Experiencia</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Estilos de Danza</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Presentaciones Anuales</div>
              </div>
            </div>

            <div className="about-highlight">
              <h4>Nuestra Misión</h4>
              <p>
                Fomentar el desarrollo integral de nuestros estudiantes a través 
                de la danza, promoviendo confianza, creatividad y excelencia artística.
              </p>
            </div>

            <div className="about-highlight">
              <h4>Nuestra Visión</h4>
              <p>
                Ser la academia de danza más reconocida por formar bailarines 
                talentosos y personas íntegras en nuestra comunidad.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="about-values">
          <h3 className="values-title">Nuestros Valores</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎭</div>
              <h4>Pasión</h4>
              <p>Llevamos pasión a cada movimiento y cada clase</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h4>Excelencia</h4>
              <p>Buscamos la excelencia en todo lo que hacemos</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Comunidad</h4>
              <p>Construimos una comunidad sólida y solidaria</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💪</div>
              <h4>Crecimiento</h4>
              <p>Impulsamos el crecimiento personal y artístico</p>
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="about-instructors">
          <h3 className="instructors-title">Nuestro Equipo de Instructores</h3>
          <p className="instructors-subtitle">Profesionales dedicados con años de experiencia en el arte de la danza</p>
          <div className="instructors-grid">
            <div className="instructor-card">
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">María López</h4>
              <p className="instructor-specialty">Directora General</p>
              <p className="instructor-bio">15 años de experiencia en danza contemporánea y bachata. Fundadora de Arte Brilla.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👨‍🏫</div>
              <h4 className="instructor-name">Carlos Rodríguez</h4>
              <p className="instructor-specialty">Instructor de Salsa</p>
              <p className="instructor-bio">Campeón nacional de salsa con 12 años enseñando la pasión del baile caribeño.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">Sophia Martínez</h4>
              <p className="instructor-specialty">Instructora de Ballet</p>
              <p className="instructor-bio">Formada en academias internacionales. Especialista en ballet clásico y neoclásico.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👨‍🏫</div>
              <h4 className="instructor-name">Diego Flores</h4>
              <p className="instructor-specialty">Instructor de Hip-Hop</p>
              <p className="instructor-bio">Bailarín profesional con 10 años de experiencia en coreografía moderna y urbana.</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="about-achievements">
          <h3 className="achievements-title">Nuestros Logros</h3>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <h4>Campeonato Nacional 2023</h4>
              <p>Nuestros bailarines ganaron 8 medallas de oro en la categoría grupos</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🎬</div>
              <h4>Presentación en TV</h4>
              <p>Participamos en transmisión televisiva de eventos culturales nacionales</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🎪</div>
              <h4>Festival Internacional</h4>
              <p>Participación en festivales de danza con reconocimiento internacional</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🌟</div>
              <h4>Acreditación Oficial</h4>
              <p>Academia acreditada por organismos nacionales de danza y cultura</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">👥</div>
              <h4>Comunidad Activa</h4>
              <p>500+ estudiantes satisfechos de todas las edades en nuestras aulas</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🎓</div>
              <h4>Egresados Exitosos</h4>
              <p>Muchos de nuestros alumnos son ahora bailarines profesionales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
