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
  const { isAuthenticated, user, logout } = useAuth();
  const enableAdmin = import.meta.env.VITE_ENABLE_ADMIN === 'true';
  const role = user?.role || '';
  const isTeacher = String(role).toUpperCase() === 'TEACHER';
  const panelPath = isTeacher ? '/teacher' : '/dashboard';

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
          <img src={logo} alt="Arte Brilla" className="logo-image" />
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
          {enableAdmin && isAuthenticated && (
            <li className="nav-button-wrapper">
              <Link to={panelPath} className={`nav-button ${location.pathname === panelPath ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Panel Admin</Link>
            </li>
          )}
          {enableAdmin && isAuthenticated && (
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
