import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Pagina no encontrada</h1>
        <p className="not-found-text">
          La ruta que intentaste abrir no existe o fue movida.
        </p>
        <Link to="/" className="not-found-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
