import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../styles/Navbar.css'
import logo from '../images/logoArteBrilla.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo de la Academia */}
        <Link to="/" className="logo-wrapper" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-text-wrapper">
            <span className="arte-text">ARTE</span>
            <div className="brilla-container">
              <span className="brilla-text">Brilla</span>
              <div className="brilla-underline"></div>
            </div>
            <span className="logo-subtitle">DANCE STUDIO</span>
          </div>
        </Link>

        {/* Botón hamburguesa */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Enlaces de navegación */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Nosotros</Link></li>
          <li><Link to="/classes" className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Clases</Link></li>
          <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
          {isAuthenticated && (
            <li className="nav-button-wrapper">
              <Link to="/admin" className={`nav-button ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Panel Admin</Link>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-button-wrapper">
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  navigate('/');
                }}
                className="nav-button logout-nav-button"
              >
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;