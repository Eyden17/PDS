import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          {/* Main Section */}
          <div className="footer-main">
            <h3>Arte Brilla</h3>
            <p className="footer-description">Academia de danza integral. Clases para Babies, Minies y Artes Proféticas.</p>
            <div className="social-links">
              <a href="#" className="social-icon" title="Instagram" aria-label="Instagram">
                📱
              </a>
              <a href="#" className="social-icon" title="WhatsApp" aria-label="WhatsApp">
                💬
              </a>
              <a href="#" className="social-icon" title="Facebook" aria-label="Facebook">
                👥
              </a>
              <a href="#" className="social-icon" title="Email" aria-label="Email">
                ✉️
              </a>
            </div>
          </div>

          {/* Grid Sections */}
          <div className="footer-grid">
            {/* Áreas */}
            <div className="footer-section">
              <h4>Áreas</h4>
              <ul className="footer-links">
                <li><a href="#babies">Babies (3-5 años)</a></li>
                <li><a href="#minies">Minies (6+ años)</a></li>
                <li><a href="#artes">Artes Proféticas</a></li>
              </ul>
            </div>

            {/* Enlaces */}
            <div className="footer-section">
              <h4>Enlaces</h4>
              <ul className="footer-links">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/about">Nosotros</Link></li>
                <li><Link to="/classes">Clases</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="footer-section">
              <h4>Contacto</h4>
              <div className="contact-info-compact">
                <p><span>📍</span> Cerca del Hospital</p>
                <p><span>📞</span> Consulta disponibilidad</p>
                <p><span>📧</span> contacto@artebrilla.com</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="copyright">
              &copy; {currentYear} Arte Brilla. Todos los derechos reservados.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacidad</a>
              <span className="divider">•</span>
              <a href="#terms">Términos</a>
              <span className="divider">•</span>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="footer-decoration"></div>
    </footer>
  );
};

export default Footer;
