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
            <h3>Arte Brilla Dance Studio</h3>
            <p className="footer-description">
              Danza que inspira propósito y comunidad en Limón. Clases para Babys, Minis y equipos de arte profética.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/yeth_w19?igsh=MWo3YjRldHJ3dGN5Yw=="
                className="social-icon"
                title="Instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 448 512"
                  role="img"
                  className="social-icon-svg"
                >
                  <defs>
                    <linearGradient id="igGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f9ce34" />
                      <stop offset="50%" stopColor="#ee2a7b" />
                      <stop offset="100%" stopColor="#6228d7" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#igGradientFooter)"
                    d="M224.1 141c-63.6 0-115.1 51.5-115.1 115.1 0 63.6 51.5 115.1 115.1 115.1 63.6 0 115.1-51.5 115.1-115.1 0-63.6-51.5-115.1-115.1-115.1zm0 190.3c-41.5 0-75.2-33.7-75.2-75.2 0-41.5 33.7-75.2 75.2-75.2 41.5 0 75.2 33.7 75.2 75.2 0 41.5-33.7 75.2-75.2 75.2zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8 0-14.9 12-26.8 26.8-26.8 14.8 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.4-93.9-36.2c-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S9.3 128.4 7.6 164.3c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.4-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8zm-48 224.5c-7.8 19.5-22.9 34.6-42.3 42.3-29.3 11.6-98.8 9-132.3 9s-103 2.6-132.3-9c-19.5-7.8-34.6-22.9-42.3-42.3-11.6-29.3-9-98.8-9-132.3s-2.6-103 9-132.3c7.8-19.5 22.9-34.6 42.3-42.3 29.3-11.6 98.8-9 132.3-9s103-2.6 132.3 9c19.5 7.8 34.6 22.9 42.3 42.3 11.6 29.3 9 98.8 9 132.3s2.7 103-9 132.3z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Grid Sections */}
          <div className="footer-grid">
            {/* Áreas */}
            <div className="footer-section">
              <h4>Áreas</h4>
              <ul className="footer-links">
                <li><Link to="/classes">Arte Brilla Babys</Link></li>
                <li><Link to="/classes">Babies Shine</Link></li>
                <li><Link to="/classes">Arte Brilla Minis</Link></li>
                <li><Link to="/classes">Arte Profética Brilla</Link></li>
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
                <p>
                  <span>📍</span>
                  <a
                    href="https://maps.google.com/?q=Conversatorio%20SINEM%2C%20Lim%C3%B3n%20centro"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Conversatorio SINEM, Limón centro
                  </a>
                </p>
                <p>
                  <span>📞</span>
                  <a href="tel:+50687345820">+506 8734-5820</a>
                </p>
                <p>
                  <span>💬</span>
                  <a
                    href="https://wa.me/50687345820"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp disponible
                  </a>
                </p>
                <p><span>⏰</span> Sábados 1:00 p.m. - 3:00 p.m.</p>
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
