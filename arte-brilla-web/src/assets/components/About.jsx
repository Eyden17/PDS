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
            Arte Brilla Dance Studio
          </p>
          <p className="about-lema" style={{fontStyle: 'italic', marginTop: '10px', fontSize: '1.1em'}}>
            "La danza transmite el ritmo que hay dentro de ti."
          </p>
        </div>

        {/* Main Content */}
        <div className="about-content">
          {/* Left Column - Text */}
          <div className="about-text">
            <h3 className="section-subheading">Nuestra Historia</h3>
            <p className="about-paragraph">
              Arte Brilla nació por una palabra con el propósito de ofrecer a los niños y jóvenes 
              de Limón un espacio donde la danza se convierta en un lenguaje de libertad, 
              sanidad y crecimiento. Desde sus inicios, la academia ha buscado cultivar el 
              talento que cada estudiante trae dentro, guiándolos con valores que fortalecen su 
              identidad, carácter y sensibilidad artística. Aquí, cada movimiento es una 
              oportunidad para descubrir quiénes somos y expresar aquello que nace del alma.
            </p>
            <p className="about-paragraph">
              Comprometida con la riqueza cultural de Limón, Arte Brilla promueve el 
              conocimiento y la valoración de nuestras raíces afrocaribeñas, costarricenses y 
              comunitarias. A través de diferentes estilos de danza, talleres y actividades, la 
              academia impulsa a los niños y jóvenes a reconocer su herencia, apreciarla y 
              defenderla con orgullo. La cultura no solo se enseña: se vive, se respira y se celebra 
              en cada clase.
            </p>
            <p className="about-paragraph">
              Bajo la dirección de Licda. Yethsira Wilson Cash, con una trayectoria de 13 años, una líder 
              apasionada por el arte y el impacto social, Arte Brilla se ha convertido en un 
              espacio seguro, creativo y formativo. La academia busca transformar su 
              comunidad mediante la disciplina, la expresión y la comunicación del movimiento. 
              Más que una escuela de danza, es un refugio de luz donde cada niño y joven 
              aprende a brillar, a confiar en su voz y a contribuir con esperanza al futuro de Limón.
            </p>

            <h3 className="section-subheading">¿Por Qué Elegir Arte Brilla?</h3>
            <ul className="about-features">
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Formación con valores cristianos y culturales</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Enfoque en la identidad cultural afrocaribeña</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Espacios seguros para expresión y creatividad</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Desarrollo integral de niños y jóvenes</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>13 años de experiencia transformando vidas</span>
              </li>
            </ul>
          </div>

          {/* Right Column - Stats/Info */}
          <div className="about-stats">
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-number">30</div>
                <div className="stat-label">Integrantes Activos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">13</div>
                <div className="stat-label">Años de Experiencia</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1</div>
                <div className="stat-label">Directora Apasionada</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Compromiso con Limón</div>
              </div>
            </div>

            <div className="about-highlight">
              <h4>Nuestra Misión</h4>
              <p>
                Fomentar el desarrollo integral de niños y jóvenes mediante la danza, promoviendo 
                valores cristianos, culturales y humanos. Creamos espacios seguros y expresivos 
                donde cada estudiante puede comunicar sus emociones, descubrir sus talentos, 
                valorar sus raíces y fortalecer su confianza. A través del arte del movimiento, 
                buscamos impactar positivamente a la comunidad de Limón, inspirando unidad, 
                respeto, identidad y transformación.
              </p>
            </div>

            <div className="about-highlight">
              <h4>Nuestra Visión</h4>
              <p>
                Ser una academia de danza que ilumina la comunidad de Limón, formando niños 
                y jóvenes que expresan con libertad el movimiento que Dios ha puesto en ellos. 
                Aspiramos a ser un referente artístico y cultural que preserve, valore y defienda la 
                riqueza de nuestra identidad social y cultural, creando generaciones que brillen 
                con amor, disciplina, creatividad y sentido de propósito.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="about-values">
          <h3 className="values-title">Nuestros Valores Institucionales</h3>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✝️</div>
              <h4>Fe y Propósito</h4>
              <p>Guiamos cada paso con los principios cristianos de amor, respeto, humildad y servicio</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h4>Identidad Cultural</h4>
              <p>Promovemos el conocimiento, respeto y orgullo por la herencia cultural de Limón y Costa Rica</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h4>Libertad Expresiva</h4>
              <p>Fomentamos espacios seguros donde cada niño y joven pueda expresar sus emociones y creatividad sin miedo ni juicio</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h4>Disciplina y Excelencia</h4>
              <p>Impulsamos el compromiso, la constancia y la responsabilidad como base del crecimiento artístico</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Comunidad y Solidaridad</h4>
              <p>Buscamos impactar positivamente nuestro entorno, sirviendo y colaborando para el bienestar de todos</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h4>Respeto y Empatía</h4>
              <p>Valoramos la diversidad, las diferencias y la dignidad de cada estudiante</p>
            </div>
            <div className="value-card">
              <div className="value-icon">😊</div>
              <h4>Alegría y Pasión</h4>
              <p>Creemos en la danza como un lenguaje vivo, lleno de energía, gozo y esperanza</p>
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="about-instructors">
          <h3 className="instructors-title">Nuestra Dirección</h3>
          <p className="instructors-subtitle">Liderazgo apasionado con vocación de servicio y amor por el arte</p>
          <div className="instructors-grid" style={{justifyContent: 'center'}}>
            <div className="instructor-card" style={{maxWidth: '400px'}}>
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">Licda. Yethsira Wilson Cash</h4>
              <p className="instructor-specialty">Directora General</p>
              <p className="instructor-bio">Con 13 años de trayectoria, es una líder apasionada por el arte y el impacto social. Ha transformado Arte Brilla en un espacio seguro, creativo y formativo que ilumina la comunidad de Limón.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">Aneby Sandi Hernández</h4>
              <p className="instructor-specialty">Docente</p>
              <p className="instructor-bio">Aneby Sandi Hernández es educadora y formadora artística, con una profunda vocación por el movimiento y la enseñanza. Como profesora de Educación Física, integra la danza y el arte del movimiento con bases pedagógicas sólidas, promoviendo la expresión y el crecimiento integral. Forma parte activa del proyecto Arte Brilla, donde acompaña procesos artísticos con niñas y jóvenes, creando espacios seguros que fortalecen la confianza, la identidad y el desarrollo humano a través de la danza.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">Jeilyn Arley Zúñiga</h4>
              <p className="instructor-specialty">Docente</p>
              <p className="instructor-bio">Yeilyn Monique Arley Zúñiga es una joven de 16 años, estudiante colegial y miembro del staff de Arte Brilla desde hace más de un año. Se destaca por su interés, sensibilidad y dedicación en la enseñanza de niñas en edades tempranas (3 a 6 años). Posee afinidad por la danza y diversas técnicas artísticas. Actualmente se desempeña como maestra del grupo “Arte Brilla Babys”, labor que realiza en conjunto con las maestras de equipo. Se caracteriza por ser responsable, comprometida y con una actitud llena de amor, alegría y vocación de servicio.</p>
            </div>
            <div className="instructor-card">
              <div className="instructor-avatar">👩‍🏫</div>
              <h4 className="instructor-name">Natalie Hernández Monterosa</h4>
              <p className="instructor-specialty">Docente</p>
              <p className="instructor-bio">Natalie es administradora y abogada de profesión. Inició su trayectoria hace aproximadamente 10 años como integrante del equipo de danza, experiencia que marcó el inicio de su compromiso con la formación artística y humana. Actualmente se desempeña como docente y coordinadora de niñas entre 5 y 8 años, rol que ha ejercido desde los inicios del proyecto Arte Brilla (Equipo Arte Brilla Baby). Su labor se distingue por la dedicación, el acompañamiento cercano y el amor con el que guía a las más pequeñas, promoviendo un ambiente de aprendizaje, confianza y expresión artística.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
